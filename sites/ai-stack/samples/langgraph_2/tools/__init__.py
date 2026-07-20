"""Agent tools, collected in one list to bind to the model.

Add a new tool by defining it in a module here and appending it to `TOOLS`.
"""

from .text import count_letter, to_upper

TOOLS = [count_letter, to_upper]

__all__ = ["TOOLS", "count_letter", "to_upper"]
