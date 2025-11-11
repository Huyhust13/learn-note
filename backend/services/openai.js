const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function polishText(content) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Giúp tôi viết lại câu input này cho mượt, hiệu chỉnh thông tin nếu phát hiện sau và làm cho nó thành một bài học, câu trả lời phải ngắn gọn, số lượng từ tương đương với câu đầu vào hoặc chỉ hơn kém nhau 20%:\n\n${content}` }
    ]
  })
  return response.choices[0].message.content;
}

module.exports = { polishText };
