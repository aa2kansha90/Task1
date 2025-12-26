# Content Moderation Filter
A rule-based content moderation system that automatically analyzes user-submitted text and determines moderation actions.

## Purpose
This system automatically moderates user-generated content by:

- Scanning text for inappropriate content (profanity, hate speech, spam, etc.)
- Calculating a severity score based on detected violations
- Making consistent moderation decisions (APPROVE/FLAG/REJECT)
- Triggering admin notifications for rejected content

## Quick Start

### Installation
```bash
git clone <repository-url>
cd content-moderation-filter

```json
const { moderateContent } = require('./main.js');

const input = {
    contentText: "Hello, this is a sample post.",
    userId: "user_123",
    contentCategory: "forum_post" // optional, defaults to 'forum_post'
};

try {
    const result = moderateContent(input);
    console.log(result);
    // Output: { decision: "APPROVE", score: 0, flaggedRules: [] }
} catch (error) {
    console.error("Moderation failed:", error.message);
}
```
### Input Format
The system expects a JSON object with:

The system expects a single JSON input object containing the text to be moderated and metadata about the user. The contentText field is required and must be a non-empty string between 1 and 10,000 characters, representing the raw text content to be analyzed. The userId field is also required and must be a string consisting only of letters, numbers, underscores (_), and hyphens (-), serving as a unique identifier for the user submitting the content. An optional contentCategory field may be provided to supply contextual information for moderation rules; when present, it must be one of the following values: forum_post, profile_bio, product_review, comment, or direct_message. If omitted, the system applies default moderation behavior.

### Example Input
```json
{
    "contentText": "This is a test post with some content.",
    "userId": "user_abc123",
    "contentCategory": "forum_post"
}

```
### Output Format

The system returns a deterministic JSON object representing the moderation outcome. The decision field is a string indicating the final moderation verdict and will be one of APPROVE, FLAG_FOR_REVIEW, or REJECT. The score field is a numeric value between 0 and 1 that represents the calculated severity of the content based on triggered moderation rules. The flaggedRules field is an array of strings identifying the specific moderation rules that were triggered during analysis, providing transparency into how the final decision was reached.

### Example Outputs
```json
{
    "decision": "APPROVE",
    "score": 0,
    "flaggedRules": []
}
```
### Content with violations:
```json
{
    "decision": "REJECT",
    "score": 0.85,
    "flaggedRules": ["profanity_detected", "hate_speech_detected"]
}
```
### Rules & Scoring
Available Rules:

- PROFANITY - Banned words/phrases
- HATE_SPEECH - Discriminatory language patterns
- EXCESSIVE_LINKS - Too many URLs (>3)
- REPETITIVE_CHARS - Same character repeated 5+ times
- SPAM_PHRASE - Common spam phrases

Scoring Logic: 

- Each rule has a weight (0.3-0.9)
- Score starts with highest triggered rule weight
- Additional rules add penalty (0.1 each, capped at +0.3)
- Final score capped at 1.0

### Decision Threshold
Moderation decisions are determined using category-specific score thresholds to reflect different tolerance levels for each content type. For forum_post, product_review, and direct_message content, submissions are approved when the severity score is below 0.3, rejected when the score is 0.7 or higher, and flagged for review when the score falls between 0.3 and 0.7. Profile_bio content is moderated more strictly: scores below 0.2 are approved, scores of 0.6 or higher are rejected, and anything in between is flagged for review. Comment content is treated with higher tolerance due to its informal nature—scores below 0.4 are approved, scores of 0.8 or higher are rejected, and scores between 0.4 and 0.8 are flagged for review.

### Architecture 
Input → Input Handler → Rule Matcher → Scoring Engine → Output Formatter → Result
        (Validation)    (Rule Checks)   (Score/Decision)  (Format/Notify)

### Core Components 
- inputHandler.js - Validates and normalizes input
- ruleMatcher.js - Applies moderation rules to text
- scoringEngine.js - Calculates score and makes decision
- outputFormatter.js - Formats output and triggers notifications
- main.js - Orchestrates the moderation pipeline

### Running Tests
# Run all tests
node tests/run_tests.js

# Run specific test suites
node tests/test_basic.js
node tests/test_edge_cases.js

### Error Handling
The system provides clear error messages for:

The system provides clear and explicit error messages to help developers quickly identify and correct input issues. If a required field is missing, such as contentText, the system returns an error indicating that the field is required. When an input has an invalid data type—for example, if userId is not a string—the system reports a type validation error. Submissions containing empty or whitespace-only text are rejected with a message stating that contentText cannot be empty. If the userId fails pattern validation due to invalid characters, an error is returned indicating an invalid format. Finally, if an unsupported value is supplied for contentCategory, the system responds with an error specifying the unknown category that was provided.

### Limitations
Technical Limitations:

- English-only - Rules optimized for English text
- No ML/AI - Rule-based only (per design decision)
- No database - Stateless, no user history tracking
- Synchronous - Single-threaded Node.js implementation
- 10K character limit - Maximum content length

### Content Limitations
- False positives - May flag safe content (e.g., "classy" contains "ass")
- Context unaware - Can't understand sarcasm or intent
- Image/Video - Text-only, no multimedia analysis
-No learning - Doesn't improve from past decisions