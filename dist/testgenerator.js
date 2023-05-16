"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUnitTest = void 0;
const prompts_1 = require("langchain/prompts");
const document_1 = require("langchain/document");
const openai_1 = require("langchain/llms/openai");
const chains_1 = require("langchain/chains");
const generateUnitTest = async (functionName) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const prompt = new prompts_1.PromptTemplate({
        template: "Write a unit test for the following typscript function: {functionName}",
        inputVariables: ["functionName"],
    });
    const docs = [
        new document_1.Document({
            pageContent: "const removeEmptyValues = (list: string[]) => {\n" +
                "    for(let item of list) {\n" +
                "        if(!item) {\n" +
                "            list.splice(list.indexOf(item), 1);\n" +
                "        }\n" +
                "    }\n" +
                "\n" +
                "    return list;\n" +
                "}",
            metadata: { functionName: "removeEmptyValues" },
        }),
    ];
    const model = new openai_1.OpenAI({
        openAIApiKey: OPENAI_API_KEY,
        temperature: 0,
        maxTokens: 100,
    });
    const chain = new chains_1.LLMChain({ llm: model, prompt: prompt });
    const res = await chain.call({
        input_documents: docs,
        functionName: functionName,
    });
    console.log({ res });
};
exports.generateUnitTest = generateUnitTest;
//# sourceMappingURL=testgenerator.js.map