import { useState, useEffect } from "react";
import "../../LeaseDraftFinal.css";
import API from "../../../api";

const formQuestions = {
  "Agreement-Details": {
    "Location": [
      "Agreement-Drafting City",
      "Agreement-Drafting State",
      "Agreement-Drafting Pincode"
    ],
    "Date": ["Agreement-Drafting Date"]
  },
  
  Parties: {
    "Landlord Info": [
      "Landlord's Full Name",
      "Landlord's Address Line 1",
      "Landlord's Address Line 2",
      "City(Landlord)",
      "State(landlord)",
      "Pincode(landlord)",
    ],
    "Tenant Info": [
      "Tenants's Full Name",
      "Tenant's Address Line 1",
      "Tenant's Address Line 2",
      "City(Tenant)",
      "State(Tenant)",
      "Pincode(Tenant)",
    ],
  },

  "Payment": {
    "Rent Amount": ["What should be the monthly rent?"],
    "Due Date": ["On which Day of the month the monthly rent should be paid?"],
    "Deposit": ["What is the Initial Deposit?"]
  },

  "Lease-Details": {
    "Lease Term": ["For how many Years/Months is the lease term?"],
    "Lease Start Date": ["What is the lease Start Date"]
  },

  "Property-Details": {
    "Address": [
      "Property Address Line 1",
      "Property Address Line 2",
      "City(Property)",
      "State(Property)",
      "Pincode(Property)"
    ],
    "Category": [
      "What is the type of Rental"
    ],
    "Rooms": [
      "No. of Bedrooms",
      "No. of Bathrooms",
      "No. of Car Parkings"
    ],
    "Area": ["Area of the property"]
  },
  "Additional-Details": {
    "Termination Period": ["How many days before should the tenant terminate lease?"]
  }
};

const isDateField = (section, subsection, question) => {
  if (
    question.toLowerCase().includes('date') ||
    subsection === 'Date' ||
    subsection === 'Lease Start Date'
  ) {
    return true;
  }
  return false;
};

const LeaseForm = ({ selectedSection, selectedSub, onNextSection }) => {
  const [allFormData, setAllFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the current form data for the selected section and subsection
  const currentFormData = allFormData[selectedSection]?.[selectedSub] || {};

  // Update the form data when the selected section or subsection changes
  useEffect(() => {
    // Ensure the current section and subsection exist in allFormData
    if (!allFormData[selectedSection]) {
      setAllFormData((prev) => ({
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          [selectedSub]: {},
        },
      }));
    } else if (!allFormData[selectedSection][selectedSub]) {
      setAllFormData((prev) => ({
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          [selectedSub]: {},
        },
      }));
    }
  }, [selectedSection, selectedSub]);

  if (!selectedSection || !selectedSub) {
    return <div className="lease-form-empty">Please select a section</div>;
  }

  const questionsArray = formQuestions[selectedSection]?.[selectedSub] || [];

  const handleChange = (questionIndex, value) => {
    // Update the form data for the current section and subsection
    setAllFormData((prev) => ({
      ...prev,
      [selectedSection]: {
        ...prev[selectedSection],
        [selectedSub]: {
          ...prev[selectedSection]?.[selectedSub],
          [questionIndex]: value,
        },
      },
    }));
  };

  const handleNext = () => {
    const isEmpty = Object.values(currentFormData).some((val) => !val?.trim());

    if (isEmpty) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    // Move to the next section or subsection
    if (onNextSection) {
      onNextSection();
    }

    alert("Section saved successfully!");
  };

  const handleDownload = async (fileType) => {
    try {
      setIsSubmitting(true);

      // Flatten the nested form data into a single key-value object
      const flattenedData = {};
      Object.keys(allFormData).forEach((section) => {
        Object.keys(allFormData[section]).forEach((subsection) => {
          Object.keys(allFormData[section][subsection]).forEach((questionIndex) => {
            const question = formQuestions[section][subsection][questionIndex];
            flattenedData[question] = allFormData[section][subsection][questionIndex];
          });
        });
      });

      // Call the API to generate the document
      const response = await API.post("/api/Generate_Lease", flattenedData, {
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `lease-agreement.${fileType}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSubmitting(false);
      alert("Document downloaded successfully!");
    } catch (error) {
      console.error("Error downloading document:", error);
      setIsSubmitting(false);
      alert("Error downloading document");
    }
  };

  const handleSubmitDocument = async () => {
    if (window.confirm("Are you sure you want to submit this Response?")) {
      setIsSubmitting(true);

      try {
        // Flatten the nested form data into a single key-value object
        const flattenedData = {};
        Object.keys(allFormData).forEach((section) => {
          Object.keys(allFormData[section]).forEach((subsection) => {
            Object.keys(allFormData[section][subsection]).forEach((questionIndex) => {
              const question = formQuestions[section][subsection][questionIndex];
              flattenedData[question] = allFormData[section][subsection][questionIndex];
            });
          });
        });

        // Send the data to the backend
        const response = await API.post("/api/Generate_Lease", flattenedData);

        setIsSubmitting(false);
        alert("Document submitted successfully!");
      } catch (error) {
        console.error("Error submitting document:", error);
        setIsSubmitting(false);
        alert("Error submitting document");
      }
    }
  };

  return (
    <div className="lease-form-container">
      <div className="lease-form-header">
        <h2 className="lease-form-title">{selectedSub}</h2>
        <div className="download-options">
          <button
            className="download-button"
            onClick={() => handleDownload("pdf")}
            disabled={isSubmitting}
          >
            Download PDF
          </button>
          <button
            className="download-button"
            onClick={() => handleDownload("docx")}
            disabled={isSubmitting}
          >
            Download DOCX
          </button>
        </div>
      </div>

      <div className="lease-form">
        {questionsArray.map((question, index) => (
          <div key={index} className="lease-form-question-group">
            <p className="lease-form-question">{question}</p>
            {isDateField(selectedSection, selectedSub, question) ? (
              <input
                type="date"
                className="lease-form-input"
                value={currentFormData[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="lease-form-input"
                value={currentFormData[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="lease-form-actions">
          <button className="lease-button-next" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="lease-form-footer">
        <button
          className="lease-button-submit"
          onClick={handleSubmitDocument}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </button>
      </div>
    </div>
  );
};

export default LeaseForm;