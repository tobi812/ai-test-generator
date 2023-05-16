import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain, loadQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { Command } from 'commander';
import { generateUnitTest } from './testgenerator';

const generateBrandName = async (product: string) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const openai = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.9,
    maxTokens: 100,
  });

  const template =
    'What would be a good and funny company name a company for a that sells {product} from Neukölln?';
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ['product'],
  });

  const chain = new LLMChain({ llm: openai, prompt: prompt });
  const result = await chain.call({ product: product });

  console.log(result);
};

const queryDataSet = async (query: string) => {
  const model = new OpenAI({});
  const chain = loadQAChain(model);

  const docs = [
    new Document({ pageContent: 'Rachel went to Harvard' }),
    new Document({ pageContent: 'Tom went to Stanford' }),
  ];

  const res = await chain.call({
    input_documents: docs,
    question: query,
  });
  console.log({ res });
};

const parseArgs = (): Command => {
  const program = new Command();
  program.argument('<query>', 'query to ask');

  program.parse(process.argv);

  return program;
};

const main = async () => {
  await generateUnitTest('removeEmptyValues');
};

main().catch(console.error);
