"""Text-manipulation tools the agent can call."""

from langchain_core.tools import tool


@tool
def count_letter(word: str, letter: str) -> int:
    """Count how many times `letter` appears in `word` (case-insensitive)."""
    return word.lower().count(letter.lower())


@tool
def to_upper(text: str) -> str:
    """Return `text` in uppercase."""
    return text.upper()
