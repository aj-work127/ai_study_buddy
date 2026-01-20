
def explain_prompt(q: str) -> str:
    return f"""
xplain the concept below for a beginner.

FORMAT STRICTLY AS:
Definition:
(one paragraph)

Explanation:
(2–3 short paragraphs)

Example:
(one simple example)

Question:
{q}
"""

def summary_prompt(q: str) -> str:
    return f"""
Summarize the topic below.

RULES:
- Bullet points only
- Maximum 6 bullets
- Each bullet ≤ 12 words


Topic:
{q}
"""

def exam_prompt(q: str) -> str:
    return f"""
You are an exam answer generator.

Rules:
- Formal tone
- No conversational language
- No extra explanations

Structure:
1. Definition
2. Key points (3–5)
3. One example



Question:
{q}
"""

def steps_prompt(q: str) -> str:
    return f"""
Explain the task below step by step.

RULES:
- Numbered steps only
- Each step ≤ 2 lines
- No extra explanation

Task:
{q}
"""

PROMPT_MAP = {
    "explain": explain_prompt,
    "summary": summary_prompt,
    "exam": exam_prompt,
    "steps": steps_prompt,
}
