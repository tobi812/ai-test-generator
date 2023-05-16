"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("langchain/llms/openai");
const prompts_1 = require("langchain/prompts");
const chains_1 = require("langchain/chains");
const document_1 = require("langchain/document");
const commander_1 = require("commander");
const testgenerator_1 = require("./testgenerator");
const generateBrandName = async (product) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new openai_1.OpenAI({
        openAIApiKey: OPENAI_API_KEY,
        temperature: 0.7,
        maxTokens: 100,
    });
    const template = "What would be a good and funny company name a company for a that sells {product} from Neukölln?";
    const prompt = new prompts_1.PromptTemplate({
        template: template,
        inputVariables: ["product"],
    });
    const chain = new chains_1.LLMChain({ llm: openai, prompt: prompt });
    const result = await chain.call({ product: product });
    console.log(result);
};
const queryDataSet = async (query) => {
    const model = new openai_1.OpenAI({});
    const chain = (0, chains_1.loadQAChain)(model);
    const docs = [
        new document_1.Document({ pageContent: "Rachel went to Harvard" }),
        new document_1.Document({ pageContent: "Tom went to Stanford" }),
    ];
    const res = await chain.call({
        input_documents: docs,
        question: query,
    });
    console.log({ res });
};
const parseArgs = () => {
    const program = new commander_1.Command();
    program.argument("<query>", "query to ask");
    program.parse(process.argv);
    return program;
};
const main = async () => {
    await (0, testgenerator_1.generateUnitTest)("removeEmptyValues");
};
main().catch(console.error);
//# sourceMappingURL=main.js.map