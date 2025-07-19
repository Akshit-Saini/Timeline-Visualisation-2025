import html2canvas from 'html2canvas';

// Utility function to convert ontology URLs to readable labels
const convertOntologyUrlToLabel = (url) => {
  if (!url) return '';
  // Extract the part after the last '#' or '/' and capitalize it
  const label = url.split('#').pop() || url.split('/').pop();
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
};

export const generateCSV = (data, filters = {}) => {
  // Apply filters to data
  let filteredData = [...data];
  
  if (filters.timePeriod?.length) {
    filteredData = filteredData.filter(item => 
      filters.timePeriod.includes(item.timePeriod)
    );
  }
  
  if (filters.gender?.length) {
    filteredData = filteredData.filter(item => 
      filters.gender.includes(item.gender)
    );
  }
  
  if (filters.birthPlace?.length) {
    filteredData = filteredData.filter(item => 
      filters.birthPlace.includes(item.birthPlace)
    );
  }
  
  if (filters.deathPlace?.length) {
    filteredData = filteredData.filter(item => 
      filters.deathPlace.includes(item.deathPlace)
    );
  }
  
  if (filters.role?.length) {
    filteredData = filteredData.filter(item => 
      filters.role.includes(item.role)
    );
  }

  // Define CSV headers
  const headers = [
    "Name",
    "Birth Date",
    "Death Date",
    "Time Period",
    "Gender",
    "Birth Place",
    "Death Place",
    "Role",
    "Bio Note",
    "Variant Name",
    "Parent",
    "Child",
    "Spouse",
    "DIB ID",
    "DIB Page",
    "Wikidata",
    "Image URL"
  ];

  // Create CSV rows
  const csvRows = [headers.join(",")];
  
  filteredData.forEach(item => {
    const row = [
      `"${item.name || ''}"`,
      `"${item.birth || ''}"`,
      `"${item.death || ''}"`,
      `"${item.timePeriod || ''}"`,
      `"${convertOntologyUrlToLabel(item.gender) || ''}"`,
      `"${item.birthPlace || ''}"`,
      `"${item.deathPlace || ''}"`,
      `"${item.role || ''}"`,
      `"${item.bioNote || ''}"`,
      `"${item.variantName || ''}"`,
      `"${item.parent || ''}"`,
      `"${item.child || ''}"`,
      `"${item.spouse || ''}"`,
      `"${item.dibId || ''}"`,
      `"${item.dibPage || ''}"`,
      `"${item.wikidata || ''}"`,
      `"${item.image || ''}"`
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
};

export const downloadCSV = (csvString, filename = "data.csv") => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateSnapshot = async (elementId, filename = "snapshot.png") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error generating snapshot:", error);
  }
};

export const generateShareableLink = (filters) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.length > 0) {
      params.append(key, value.join(","));
    }
  });
  
  return `${baseUrl}?${params.toString()}`;
}; 