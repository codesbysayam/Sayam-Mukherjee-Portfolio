import React, { memo } from "react";
import Journal from "../pages/Journal";

function BlogsSectionComponent() {
  return (
    <section id="journal" aria-label="Engineering Journal & Notes" className="w-full">
      <Journal />
    </section>
  );
}

const BlogsSection = memo(BlogsSectionComponent);
export default BlogsSection;
