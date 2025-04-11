import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  
  "Parties": {
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
    "Area": ["Area of the property(in sqft.)"]
  },
  "Additional-Details": {
    "Termination Period": ["How many days before should the tenant terminate lease?"],
    "Witness-Info":["Witness 1 Name", "Witness 2 Name"],
  },
  "Additional-Clauses": {
    "Additional Clauses": [
      "Any additional clauses to be added?"
    ]
  }
};

const rentalTypes = [
  "Apartment",
  "House",
  "Condo",
  "Townhouse",
  "Studio",
  "Duplex",
  "Villa",
  "Penthouse",
  "Loft",
  "Other"
];

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

const isYearsMonthsQuestion = (section, subsection, question) => {
  return question.includes("Years/Months");
};

const LeaseForm = ({ selectedSection, selectedSub, onNextSection }) => {
  const [allFormData, setAllFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const [clauseInput, setClauseInput] = useState("");
  const [isGeneratingClause, setIsGeneratingClause] = useState(false);
  const [generatedClauses, setGeneratedClauses] = useState([]);
  const [addedClauses, setAddedClauses] = useState([]);
  const [clauseExamples, setClauseExamples] = useState([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  // const [showPreview, setShowPreview] = useState(false);
  // const [previewContent, setPreviewContent] = useState("");

  // Fetch clause examples
  useEffect(() => {
    if (selectedSection === "Additional-Clauses" && clauseExamples.length === 0) {
      fetchClauseExamples();
    }
  }, [selectedSection]);

  const fetchClauseExamples = async () => {
    setLoadingExamples(true);
    try {
      const response = await API.get("/api/clause_examples");
      if (response.data && response.data.success) {
        setClauseExamples(response.data.examples);
      }
    } catch (error) {
      console.error("Error fetching clause examples:", error);
    } finally {
      setLoadingExamples(false);
    }
  };

  const getCurrentSubsections = () => {
    return Object.keys(formQuestions[selectedSection] || {});
  };

  const getCurrentSubsectionIndex = () => {
    const subsections = getCurrentSubsections();
    return subsections.indexOf(selectedSub);
  };

  const hasNextSubsection = () => {
    const subsections = getCurrentSubsections();
    const currentIndex = getCurrentSubsectionIndex();
    return currentIndex < subsections.length - 1;
  };

  const getNextSubsection = () => {
    const subsections = getCurrentSubsections();
    const currentIndex = getCurrentSubsectionIndex();
    return subsections[currentIndex + 1];
  };

  const isCurrentSubsectionFilled = () => {
    if (selectedSection === "Additional-Clauses") {
      return true;
    }
    
    const questions = formQuestions[selectedSection]?.[selectedSub] || [];
    for (let i = 0; i < questions.length; i++) {
      const value = allFormData[selectedSection]?.[selectedSub]?.[i];
      const question = questions[i];
      
      if (isYearsMonthsQuestion(selectedSection, selectedSub, question)) {
        if (!value?.years?.toString().trim() || !value?.months?.toString().trim()) {
          return false;
        }
      } else if (!value?.toString().trim()) {
        return false;
      }
    }
    return true;
  };

  const currentFormData = allFormData[selectedSection]?.[selectedSub] || {};

  useEffect(() => {
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
  }, [selectedSection, selectedSub, allFormData]);

  if (!selectedSection || !selectedSub) {
    return <div className="lease-form-empty">Please select a section</div>;
  }

  const questionsArray = formQuestions[selectedSection]?.[selectedSub] || [];

  const handleChange = (questionIndex, value) => {
    const question = formQuestions[selectedSection][selectedSub][questionIndex];
    
    if (isYearsMonthsQuestion(selectedSection, selectedSub, question)) {
      setAllFormData((prev) => ({
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          [selectedSub]: {
            ...prev[selectedSection]?.[selectedSub],
            [questionIndex]: {
              years: value.years || "",
              months: value.months || ""
            },
          },
        },
      }));
    } else {
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
    }
  };

  const flattenFormData = () => {
    const flattened = {
      documentName: sessionStorage.getItem("documentName") || "lease-agreement",
      username: sessionStorage.getItem("username") || "anonymous",
      additional_clauses: addedClauses.map(c => c.content)
    };

    Object.keys(allFormData).forEach((section) => {
      Object.keys(allFormData[section]).forEach((subsection) => {
        Object.keys(allFormData[section][subsection]).forEach((questionIndex) => {
          const question = formQuestions[section][subsection][questionIndex];
          const value = allFormData[section][subsection][questionIndex];
          
          if (isYearsMonthsQuestion(section, subsection, question)) {
            flattened[`${question},years`] = value.years || "";
            flattened[`${question},months`] = value.months || "";
          } else {
            flattened[question] = value;
          }
        });
      });
    });

    return flattened;
  };

  // const handlePreview = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     const flattenedData = flattenFormData();

  //     const response = await API.post("/api/Generate_Lease/preview", {
  //       ...flattenedData,
  //       preview: true
  //     });

  //     if (response.data && response.data.success) {
  //       setPreviewContent(response.data.preview_text);
  //       setShowPreview(true);
  //     }
  //   } catch (error) {
  //     console.error("Error generating preview:", error);
  //     alert("Error generating preview");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleNext = () => {
    if (!isCurrentSubsectionFilled()) {
      setShowRequiredError(true);
      return;
    }

    setShowRequiredError(false);
    alert("Details have been saved successfully!");
    
    if (onNextSection && hasNextSubsection()) {
      onNextSection(getNextSubsection());
    }
  };

  const handleDownload = async (fileType) => {
    try {
      setIsSubmitting(true);
      const flattenedData = flattenFormData();

      const response = await API.post("/api/Generate_Lease", {
        ...flattenedData,
        saveToUserFolder: false
      }, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${flattenedData.documentName}.${fileType}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error downloading document:", error);
      setIsSubmitting(false);
      alert("Error downloading document");
    }
  };

  const handleCreateDocument = async () => {
    const { allFilled, section, subsection, index } = isAllQuestionsFilled();
    
    if (!allFilled) {
      alert(`Please fill all required fields. The first missing field is in ${subsection}: ${formQuestions[section][subsection][index]}`);
      return;
    }

    if (window.confirm("Are you sure you want to create this document?")) {
      setIsSubmitting(true);
      const flattenedData = flattenFormData();

      try {
        const response = await API.post("/api/Generate_Lease", {
          ...flattenedData,
          saveToUserFolder: true
        });

        if (response.data && response.data.success) {
          alert(`Document "${flattenedData.documentName}" created successfully and saved to your user folder!`);
        } else {
          alert("Document created successfully!");
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error creating document:", error);
        setIsSubmitting(false);
        alert("Error creating document");
      }
    }
  };

  const isAllQuestionsFilled = () => {
    for (const section in formQuestions) {
      if (section === "Additional-Clauses") {
        continue;
      }
      
      for (const subsection in formQuestions[section]) {
        const questions = formQuestions[section][subsection];
        for (let i = 0; i < questions.length; i++) {
          const value = allFormData[section]?.[subsection]?.[i];
          const question = questions[i];
          
          if (isYearsMonthsQuestion(section, subsection, question)) {
            if (!value?.years?.toString().trim() || !value?.months?.toString().trim()) {
              return { allFilled: false, section, subsection, index: i };
            }
          } else if (!value?.toString().trim()) {
            return { allFilled: false, section, subsection, index: i };
          }
        }
      }
    }
    return { allFilled: true };
  };

  const isRentalTypeQuestion = (section, subsection, question) => {
    return section === "Property-Details" && 
           subsection === "Category" && 
           question === "What is the type of Rental";
  };

  const handleGenerateClause = async () => {
    if (!clauseInput.trim()) {
      alert("Please enter a description for the clause you want to generate");
      return;
    }
    
    setIsGeneratingClause(true);
    
    try {
      const flattenedData = flattenFormData();
      
      const response = await API.post("/api/generate_clause", {
        ...flattenedData,
        clause_request: clauseInput
      });
      
      if (response.data && response.data.success) {
        setGeneratedClauses([...generatedClauses, response.data.clause]);
        setClauseInput("");
      } else {
        alert("Error generating clause: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error generating clause:", error);
      alert("Error generating clause. Please try again.");
    } finally {
      setIsGeneratingClause(false);
    }
  };
  
  const handleAddClause = (clause, index) => {
    setAddedClauses([...addedClauses, { id: Date.now(), content: clause }]);
    removeClause(index);
  };

  const removeClause = (index) => {
    const newClauses = [...generatedClauses];
    newClauses.splice(index, 1);
    setGeneratedClauses(newClauses);
  };

  const removeAddedClause = (id) => {
    setAddedClauses(addedClauses.filter(c => c.id !== id));
  };

  const handleClauseExample = (example) => {
    setClauseInput(example.description);
  };

  const clearAllClauses = () => {
    if (window.confirm("Are you sure you want to remove all added clauses?")) {
      setAddedClauses([]);
    }
  };

  if (selectedSection === "Additional-Clauses") {
    return (
      <div className="lease-form-container">
        <div className="lease-form-header">
          <h2 className="lease-form-title">{selectedSub}</h2>
          <div className="download-options">
            {/* <button
              className="preview-button"
              onClick={handlePreview}
              disabled={isSubmitting}
            >
              Preview Document
            </button> */}
            <button
              className="download-button"
              onClick={() => handleDownload("docx")}
              disabled={isSubmitting}
            >
              Download DOCX
            </button>
          </div>
        </div>

        {/* {showPreview && (
          <div className="preview-modal">
            <div className="preview-content">
              <div className="preview-header">
                <h3>Document Preview</h3>
                <button 
                  className="close-preview"
                  onClick={() => setShowPreview(false)}
                >
                  &times;
                </button>
              </div>
              <div className="preview-text">
                {previewContent || "No preview content available"}
              </div>
            </div>
          </div>
        )} */}

        <div className="lease-form">
          <div className="indian-law-notice">
            <p>All clauses will be generated in accordance with Indian rental laws and regulations</p>
          </div>
          
          <div className="clause-examples-toggle">
            <button 
              onClick={() => setShowExamples(!showExamples)}
              className="toggle-examples-button"
            >
              {showExamples ? "Hide Examples" : "Show Common Clause Examples"}
            </button>
          </div>
          
          {showExamples && (
            <div className="clause-examples-container">
              {loadingExamples ? (
                <p>Loading examples...</p>
              ) : (
                <>
                  <h3>Common Lease Clauses</h3>
                  <div className="clause-examples-grid">
                    {clauseExamples.map((example, index) => (
                      <div key={index} className="clause-example-card">
                        <h4>{example.title}</h4>
                        <p>{example.description}</p>
                        <button 
                          onClick={() => handleClauseExample(example)}
                          className="use-example-button"
                        >
                          Use This
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="lease-form-question-group">
            <p className="lease-form-question">
              Describe the clause you want to add
            </p>
            <textarea
              className="lease-form-textarea"
              value={clauseInput}
              onChange={(e) => setClauseInput(e.target.value)}
              placeholder="E.g., 'Add a pet policy that allows small pets but requires an additional deposit'"
              rows={4}
            />
            <button 
              className="generate-clause-button" 
              onClick={handleGenerateClause}
              disabled={isGeneratingClause}
            >
              {isGeneratingClause ? "Generating..." : "Generate Clause"}
            </button>
          </div>

          {generatedClauses.length > 0 && (
            <div className="generated-clauses-container">
              <h3>Generated Clauses ({generatedClauses.length})</h3>
              {generatedClauses.map((clause, index) => (
                <div key={index} className="generated-clause">
                  <div className="clause-content">{clause}</div>
                  <div className="clause-actions">
                    <button 
                      className="add-clause-button"
                      onClick={() => handleAddClause(clause, index)}
                    >
                      Add to Document
                    </button>
                    <button 
                      className="remove-clause-button" 
                      onClick={() => removeClause(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {addedClauses.length > 0 && (
            <div className="added-clauses-container">
              <div className="added-clauses-header">
                <h3>Clauses in Document ({addedClauses.length})</h3>
                <button 
                  className="clear-all-button"
                  onClick={clearAllClauses}
                >
                  Clear All
                </button>
              </div>
              {addedClauses.map((clause) => (
                <div key={clause.id} className="added-clause">
                  <div className="clause-content">{clause.content}</div>
                  <button 
                    className="remove-clause-button" 
                    onClick={() => removeAddedClause(clause.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="lease-form-actions">
            <button className="lease-button-next" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>

        <div className="lease-form-footer">
          <button
            className="lease-button-submit"
            onClick={handleCreateDocument}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Document"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lease-form-container">
      <div className="lease-form-header">
        <h2 className="lease-form-title">{selectedSub}</h2>
        <div className="download-options">
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
            <p className="lease-form-question">
              {question}
              <span className="required-asterisk">*</span>
            </p>
            
            {isYearsMonthsQuestion(selectedSection, selectedSub, question) ? (
              <div className="years-months-input-group">
                <input
                  type="number"
                  className="lease-form-input"
                  placeholder="Years"
                  value={currentFormData[index]?.years || ""}
                  onChange={(e) => handleChange(index, {
                    ...currentFormData[index],
                    years: e.target.value
                  })}
                  min="0"
                  required
                />
                <input
                  type="number"
                  className="lease-form-input"
                  placeholder="Months"
                  value={currentFormData[index]?.months || ""}
                  onChange={(e) => handleChange(index, {
                    ...currentFormData[index],
                    months: e.target.value
                  })}
                  min="0"
                  max="11"
                  required
                />
              </div>
            ) : isDateField(selectedSection, selectedSub, question) ? (
              <input
                type="date"
                className="lease-form-input"
                value={currentFormData[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              />
            ) : isRentalTypeQuestion(selectedSection, selectedSub, question) ? (
              <select
                className="lease-form-input"
                value={currentFormData[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              >
                <option value="">Select rental type</option>
                {rentalTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="lease-form-input"
                value={currentFormData[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              />
            )}
          </div>
        ))}

        {showRequiredError && (
          <div className="error-message">
            Please fill all required fields before proceeding.
          </div>
        )}

        <div className="lease-form-actions">
          <button className="lease-button-next" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="lease-form-footer">
        <button
          className="lease-button-submit"
          onClick={handleCreateDocument}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Document"}
        </button>
      </div>
    </div>
  );
};

LeaseForm.propTypes = {
  selectedSection: PropTypes.string.isRequired,
  selectedSub: PropTypes.string.isRequired,
  onNextSection: PropTypes.func,
};

export default LeaseForm;
