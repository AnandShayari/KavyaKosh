import OpenAI from 'openai';
import config from '../config/index.js';
import AIHistory from '../models/AIHistory.js';
import User from '../models/User.js';

const openai = config.openai.apiKey ? new OpenAI({ apiKey: config.openai.apiKey }) : null;

const POETRY_TYPES = {
  shayari: 'Write a beautiful shayari (couplet poetry)',
  ghazal: 'Write a complete ghazal with matla and maqta',
  poem: 'Write an evocative poem',
  nazm: 'Write a nazm (free verse Urdu/Hindi poetry)',
  quote: 'Write an inspiring literary quote',
  haiku: 'Write a traditional haiku (5-7-5 syllables)',
  caption: 'Write a poetic social media caption',
  story: 'Write a short poetic story',
  lyrics: 'Write song lyrics with verses and chorus',
};

const buildSystemPrompt = (options) => {
  const { type, language, mood, style, tone, creativity, length, audience, literaryDevice, rhymingScheme, keywords } = options;
  let prompt = `You are KavyaKosh AI, the world's most advanced literary AI assistant specializing in ${language || 'Hindi/Urdu'} poetry and literature. `;
  prompt += POETRY_TYPES[type] || 'Write beautiful poetry';
  if (mood) prompt += `. Mood: ${mood}`;
  if (style) prompt += `. Style: ${style}`;
  if (tone) prompt += `. Tone: ${tone}`;
  if (audience) prompt += `. Audience: ${audience}`;
  if (literaryDevice) prompt += `. Use literary device: ${literaryDevice}`;
  if (rhymingScheme) prompt += `. Rhyming scheme: ${rhymingScheme}`;
  if (keywords) prompt += `. Include keywords: ${keywords}`;
  const lengthMap = { 1: 'very short (2-4 lines)', 2: 'short (4-8 lines)', 3: 'medium (8-16 lines)', 4: 'long (16-30 lines)', 5: 'extended (30+ lines)' };
  prompt += `. Length: ${lengthMap[length] || lengthMap[3]}`;
  if (creativity >= 4) prompt += '. Be highly creative and experimental.';
  else if (creativity <= 2) prompt += '. Keep it classical and traditional.';
  prompt += ' Format beautifully with line breaks. Do not include explanations unless asked.';
  return prompt;
};

export const generatePoetry = async (userId, options, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!openai) {
    res.write(`data: ${JSON.stringify({ error: 'OpenAI API key not configured.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  const systemPrompt = buildSystemPrompt(options);
  const userPrompt = options.prompt || `Generate ${options.type} in ${options.language || 'Hindi'}`;

  let fullResponse = '';
  let tokensUsed = 0;

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      temperature: (options.creativity || 3) / 5,
      max_tokens: options.length >= 4 ? 2000 : 1000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      if (chunk.usage) tokensUsed = chunk.usage.total_tokens;
    }

    if (userId) {
      await AIHistory.create({
        user: userId,
        prompt: userPrompt,
        response: fullResponse,
        type: options.type,
        language: options.language,
        mood: options.mood,
        style: options.style,
        tokensUsed,
        action: options.action || 'generate',
      });
      await User.findByIdAndUpdate(userId, {
        $inc: { 'apiUsage.tokensUsed': tokensUsed, 'apiUsage.requests': 1 },
      });
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
};

export const aiAction = async (userId, action, content, options = {}) => {
  if (!openai) throw new Error('OpenAI API key not configured');

  const actionPrompts = {
    improve: 'Improve this poetry while keeping its essence. Make it more evocative and polished:',
    rewrite: 'Rewrite this poetry in a fresh, unique way:',
    continue: 'Continue writing this poetry naturally:',
    expand: 'Expand this poetry with more depth, imagery, and verses:',
    shorten: 'Shorten this poetry while preserving its core message and beauty:',
    translate: `Translate this poetry to ${options.targetLanguage || 'English'}:`,
    explain: 'Explain the meaning, literary devices, and emotions in this poetry:',
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are KavyaKosh AI, an expert literary assistant.' },
      { role: 'user', content: `${actionPrompts[action]}\n\n${content}` },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const result = response.choices[0].message.content;
  const tokensUsed = response.usage?.total_tokens || 0;

  if (userId) {
    await AIHistory.create({
      user: userId,
      prompt: content,
      response: result,
      type: options.type || 'poem',
      tokensUsed,
      action,
    });
    await User.findByIdAndUpdate(userId, {
      $inc: { 'apiUsage.tokensUsed': tokensUsed, 'apiUsage.requests': 1 },
    });
  }

  return { result, tokensUsed };
};

export const aiReview = async (content) => {
  if (!openai) throw new Error('OpenAI API key not configured');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a literary critic. Review the poetry and return JSON with scores (1-10) for emotion, creativity, grammar, rhythm, imagery, plus suggestions array and summary.',
      },
      { role: 'user', content },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  return JSON.parse(response.choices[0].message.content);
};
