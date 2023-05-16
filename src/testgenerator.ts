import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import { OpenAI } from 'langchain/llms/openai';
import { LLMChain, SimpleSequentialChain } from 'langchain/chains';
import fs from 'fs';
import * as process from 'process';
import YAML from 'yaml';
import { runCLI } from 'jest';
import { ChainValues } from 'langchain/dist/schema';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new OpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0,
  maxTokens: 200,
});

interface MetaPromptData {
  prompts: {
    instructions: string;
  }[];
}

interface Task {
  language: string;
  instructions: string[];
  requirements: string[];
}

interface PromptData {
  tasks: Task[];
}

export const generateUnitTest = async (functionName: string) => {
  const metaPromptFile = fs.readFileSync('src/meta_prompt.yaml', 'utf8');
  const metaPromptParsed: MetaPromptData = YAML.parse(metaPromptFile);

  const promptFile = fs.readFileSync('src/prompt.yaml', 'utf8');
  const promptParsed: PromptData = YAML.parse(promptFile);

  const prompt = new PromptTemplate({
    template:
      metaPromptParsed.prompts[0].instructions +
      '\n' +
      YAML.stringify(promptParsed.tasks[0]),
    inputVariables: ['functionName'],
  });

  const fileContent = fs.readFileSync('src/testgenerator.ts', 'utf8');

  const docs = [
    new Document({
      pageContent: fileContent,
      metadata: { functionName: 'removeEmptyValues' },
    }),
  ];

  console.log(await prompt.format({functionName: 'removeEmptyValues'}));
  const chain = new LLMChain({ llm: model, prompt: prompt });

  let unitTest = await chain.call({
    input_documents: docs,
    functionName: functionName,
  });

  fs.writeFileSync('src/removeEmptyValues.spec.ts', unitTest.text, 'utf8');

  const config = {
    rootDir: '.',
    testRegex: 'src/removeEmptyValues.spec.ts',
  };

  let result = await runCLI(config as any, ['.']);

  let retries = 0;
  const maxRetries = 5;
  console.log(result.results.numFailedTestSuites);
  while (result.results.numFailedTestSuites > 0 && retries < maxRetries) {
    retries++;
    unitTest = await fixTest(
      result.results.testResults[0].failureMessage,
      docs,
      unitTest,
    );
    fs.writeFileSync('src/removeEmptyValues.spec.ts', unitTest.text, 'utf8');
    result = await runCLI(config as any, ['.']);
    console.log(retries);
  }
};

const fixTest = async (
  failureMessage: string,
  docs: Document[],
  firstDraft: ChainValues,
) => {
  const prompt = new PromptTemplate({
    template:
      'When the running the test it produces this output: {exception}. Refactor test so it passes.',
    inputVariables: ['exception'],
  });
  docs.push(new Document({ pageContent: firstDraft.text }));

  const chain = new LLMChain({ llm: model, prompt: prompt });
  const result = await chain.call({
    input_documents: docs,
    exception: failureMessage,
  });

  console.log(result.text);

  return result;
};
