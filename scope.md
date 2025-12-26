# Scope: Content Moderation Filter Workflow
 
## Workflow Description
This workflow performs automated content moderation on user-generated text. It is a deterministic, rule-based system that evaluates input content against a series of validation layers to produce a moderation verdict and supporting details.

**Core Logic Flow:**
1.  **Input Reception & Validation:** The system receives and validates the required `contentText` and `userId`. It checks for basic data types and required fields.
2.  **Preprocessing:** The text is normalized (e.g., converted to lowercase, trimmed of extra whitespace).
3.  **Rule-Based Analysis Layer:** The normalized text is processed sequentially through a set of predefined validation rules:
    *   **Profanity Check:** Scans against a configurable list of banned words/phrases.
    *   **Hate Speech Patterns:** Checks for patterns targeting protected groups using regex and keyword lists.
    *   **Spam Indicator Detection:** Looks for excessive links, repetitive characters, or common spam phrases.
    *   **Severity Scoring:** Each triggered rule contributes to an overall risk `score` (0-1), and its identifier is added to the `flaggedRules` array.
4.  **Context Adjustment:** If provided, the `contentCategory` may adjust the sensitivity thresholds for certain rules (e.g., a "profile_bio" might have stricter rules than a "forum_post").
5.  **Decision Engine:** The final `score` and specific `flaggedRules` are evaluated against thresholds to determine the action:
    *   `SCORE < 0.3` → **"APPROVE"**
    *   `0.3 <= SCORE < 0.7` → **"FLAG_FOR_REVIEW"**
    *   `SCORE >= 0.7` → **"REJECT"**
6.  **Output & Notification:** The structured result (`decision`, `score`, `flaggedRules`) is returned. If the decision is `"REJECT"`, an internal notification event for administrators is also triggered.

## Non-Goals
- `Database Integration`: This workflow will not perform any read or write operations to a database. All necessary data must be passed in the input.

- `AI/ML Processing`: The moderation logic will be based solely on static rules, regex patterns, and keyword lists. It will not call or train any machine learning or artificial intelligence models.

## Inputs
The workflow accepts a single JSON object with the following properties:
- `contentText` (string, required): The text content to be moderated (e.g., a comment, post, or message).
- `userId` (string, required): The identifier of the user who submitted the content.
- `contentCategory` (string, optional): Context of the content (e.g., "forum_post", "profile_bio"). Influences rule strictness.

## Outputs
The workflow returns a JSON object with the following structure:
```json
{
  "decision": "APPROVE | FLAG_FOR_REVIEW | REJECT",
  "score": "<A numerical severity score between 0 and 1>",
  "flaggedRules": ["<Array of rule identifiers that were triggered>"]
}

