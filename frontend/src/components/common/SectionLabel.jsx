import React from "react";

function SectionLabel({ children, className = "" }) {
  return (
    <div className={`section-label ${className}`}>
      <span className="section-label-slash" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export default SectionLabel;