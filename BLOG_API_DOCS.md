# Blog Integration API Documentation

This internal API endpoint allows external microservices to publish new blog posts directly to your website.

## Endpoint Details

*   **URL:** `https://talhatech.vercel.app/api/blog`
*   **Method:** `POST`
*   **Content-Type:** `application/json`

---

## Authentication

Authentication is handled via a secure custom API Key header:

*   **Header Name:** `x-api-key`
*   **Header Value:** The secret key configured in your environment variables (`BLOG_API_KEY`).

> [!WARNING]
> Requests without a valid `x-api-key` header will be rejected with a `401 Unauthorized` status.

### Server Setup (Environment Variable)
To activate this endpoint, define the secret key in your `.env` file (locally) and under your Vercel project environment settings:

```env
BLOG_API_KEY="your-super-secret-random-api-key-here"
```

---

## Payload Format (JSON)

The endpoint accepts a JSON object with the following fields:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | **Yes** | The title of the article. An SEO slug is automatically generated from this. |
| `description` | String | **Yes** | A short, compelling excerpt/summary shown on listing cards. |
| `content` | String | **Yes** | The full body content of the blog post. Markdown syntax is fully supported. |
| `tags` | Array of Strings | **Yes** | Categorizing tags (e.g. `["React", "Next.js", "WebDev"]`). |
| `imageUrl` | String | No | A public CDN image URL (e.g. from Uploadthing or Unsplash) for the cover. |

---

## Example Request

### JSON Payload
```json
{
  "title": "Automating Deployments with Github Actions",
  "description": "Learn how to write optimized workflows for Next.js deployments.",
  "content": "Continuous Integration and Continuous Deployment (CI/CD) speeds up development cycles...\n\n### 1. Simple Workflow\nWrite your configuration in `.github/workflows/deploy.yml`...",
  "tags": ["Git", "CI-CD", "DevOps"],
  "imageUrl": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200"
}
```

### curl Request
```bash
curl -X POST https://talhatech.vercel.app/api/blog \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-super-secret-random-api-key-here" \
  -d '{
    "title": "Automating Deployments with Github Actions",
    "description": "Learn how to write optimized workflows for Next.js deployments.",
    "content": "Continuous Integration and Continuous Deployment (CI/CD) speeds up development...",
    "tags": ["Git", "CI-CD", "DevOps"],
    "imageUrl": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200"
  }'
```

### JavaScript / Node.js fetch
```javascript
const response = await fetch("https://talhatech.vercel.app/api/blog", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "your-super-secret-random-api-key-here"
  },
  body: JSON.stringify({
    title: "Automating Deployments with Github Actions",
    description: "Learn how to write optimized workflows for Next.js deployments.",
    content: "Continuous Integration and Continuous Deployment (CI/CD)...",
    tags: ["Git", "CI-CD", "DevOps"],
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200"
  })
});

const result = await response.json();
console.log(result);
```

---

## Response Formats

### 1. Success (Status `201 Created`)
```json
{
  "success": true,
  "message": "Blog post published successfully!",
  "data": {
    "id": "cmqw5767p0000ov4qkl2x9tvw",
    "title": "Automating Deployments with Github Actions",
    "slug": "automating-deployments-with-github-actions",
    "url": "https://talhatech.vercel.app/blog/automating-deployments-with-github-actions"
  }
}
```

### 2. Validation Failure (Status `400 Bad Request`)
```json
{
  "success": false,
  "error": "Missing required fields: title, description, and content are required."
}
```

### 3. Invalid API Key (Status `401 Unauthorized`)
```json
{
  "success": false,
  "error": "Unauthorized. Invalid or missing API key."
}
```
