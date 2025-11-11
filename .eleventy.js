export default function(eleventyConfig) {
  // Pass through assets folder
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Pass through robots.txt as-is
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Pass through client logos from public directory
  eleventyConfig.addPassthroughCopy({ "public/client_logos": "client_logos" });
  
  // Add filter to check if URL is active
  eleventyConfig.addFilter("isActive", function(currentUrl, targetUrl) {
    if (targetUrl === "/" && currentUrl === "/") {
      return true;
    }
    if (targetUrl === "/home.html" && (currentUrl === "/" || currentUrl === "/home.html")) {
      return true;
    }
    if (targetUrl !== "/" && currentUrl && currentUrl.startsWith(targetUrl)) {
      return true;
    }
    return false;
  });
  
  // Add current year filter
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
