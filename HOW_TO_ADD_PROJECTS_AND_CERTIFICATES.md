# How to Add Projects and Certificates

## 📁 Where to Edit

All projects and certificates are stored in JSON files in the `data/` directory:

- **Projects:** `data/projects.json`
- **Certificates:** `data/certificates.json`

## ➕ How to Add a Project

1. Open `data/projects.json`
2. Add a new project object to the `projects` array
3. Save the file
4. Refresh your browser (or restart the server if needed)

### Project Format

```json
{
  "id": 4,
  "title": "My Awesome Project",
  "description": "A detailed description of what this project does and what technologies it uses.",
  "image": "/images/project-image.jpg",
  "link": "https://github.com/username/project",
  "technologies": ["JavaScript", "Node.js", "React", "MongoDB"]
}
```

### Project Fields

- **id** (required): Unique number for each project
- **title** (required): Project name
- **description** (required): Project description
- **image** (optional): Path to project image (e.g., `/images/project1.jpg`)
  - If not provided, a placeholder will be shown
  - Place images in `public/images/` directory
- **link** (optional): URL to project (GitHub, live demo, etc.)
- **technologies** (optional): Array of technology names (e.g., `["JavaScript", "Node.js"]`)

### Example: Adding a New Project

```json
{
  "projects": [
    {
      "id": 1,
      "title": "Portfolio Website",
      "description": "A modern portfolio website built with Node.js, Express, and TypeScript.",
      "image": "/images/portfolio.jpg",
      "link": "https://github.com/username/portfolio",
      "technologies": ["Node.js", "TypeScript", "Express", "EJS"]
    },
    {
      "id": 2,
      "title": "E-Commerce Platform",
      "description": "Full-stack e-commerce application with user authentication and payment processing.",
      "image": null,
      "link": "https://example.com",
      "technologies": ["React", "Node.js", "MongoDB", "Stripe"]
    }
  ]
}
```

## 🏆 How to Add a Certificate

1. Open `data/certificates.json`
2. Add a new certificate object to the `certificates` array
3. Save the file
4. Refresh your browser (or restart the server if needed)

### Certificate Format

```json
{
  "id": 4,
  "title": "AWS Certified Solutions Architect",
  "description": "Certified in designing distributed systems on AWS.",
  "issuer": "Amazon Web Services",
  "date": "January 2024",
  "link": "https://www.credly.com/badges/..."
}
```

### Certificate Fields

- **id** (required): Unique number for each certificate
- **title** (required): Certificate name
- **description** (required): Certificate description
- **issuer** (optional): Organization that issued the certificate
- **date** (optional): Date when certificate was obtained
- **link** (optional): URL to verify/view certificate (e.g., Credly, LinkedIn)

### Example: Adding a New Certificate

```json
{
  "certificates": [
    {
      "id": 1,
      "title": "CCNA - Cisco Certified Network Associate",
      "description": "Certified in network fundamentals, IP connectivity, and security fundamentals.",
      "issuer": "Cisco",
      "date": "March 2024",
      "link": "https://www.credly.com/badges/..."
    },
    {
      "id": 2,
      "title": "JavaScript Algorithms and Data Structures",
      "description": "Completed freeCodeCamp's JavaScript certification.",
      "issuer": "freeCodeCamp",
      "date": "December 2023",
      "link": null
    }
  ]
}
```

## 🖼️ Adding Project Images

1. Place your image files in the `public/images/` directory
2. Use the path in your project JSON: `/images/your-image.jpg`
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`

Example:
- Image file: `public/images/my-project.png`
- JSON path: `"/images/my-project.png"`

## ✏️ Editing Existing Items

1. Open the appropriate JSON file
2. Find the item you want to edit
3. Modify the fields
4. Save the file
5. Refresh your browser

## 🗑️ Removing Items

1. Open the appropriate JSON file
2. Delete the entire object (including the comma before it if it's not the last item)
3. Save the file
4. Refresh your browser

## 📝 Tips

- **Keep IDs unique**: Each project and certificate should have a unique `id`
- **Use proper JSON syntax**: Make sure all strings are in quotes, arrays use brackets `[]`, and objects use braces `{}`
- **Commas matter**: Add commas between items, but not after the last item
- **Test your JSON**: Use an online JSON validator if you get errors
- **Backup your data**: Keep a backup of your JSON files before making major changes

## 🔄 After Making Changes

- **No server restart needed**: Just refresh your browser
- **If changes don't appear**: Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)
- **Check the console**: If there are errors, check the browser console and server logs

## 📂 File Locations

- Projects: `/Users/talbarkan/Desktop/portfolo/data/projects.json`
- Certificates: `/Users/talbarkan/Desktop/portfolo/data/certificates.json`
- Images: `/Users/talbarkan/Desktop/portfolo/public/images/`

## 🎨 Styling

Projects and certificates automatically use the portfolio's styling:
- Cards with hover effects
- Responsive grid layout
- Theme support (light/dark mode)
- Technology tags for projects
- Issuer and date info for certificates

No CSS changes needed - just edit the JSON files!

