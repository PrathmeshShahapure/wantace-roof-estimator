import { useEffect, useState } from "react";
import { getConfig, getEstimate, submitLead } from "./services/api";

function App() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [estimate, setEstimate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        setError(error.message);
      }
    };

    loadConfig();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!config) {
    return <p>Loading estimator...</p>;
  }

  if (estimate) {
    return (
      <div>
        <h1>Northline Roofing & Exteriors</h1>

        <h2>Your Estimated Cost</h2>

        <h1>
          ${estimate.estimate_low.toLocaleString()} – $
          {estimate.estimate_high.toLocaleString()}
        </h1>

        <p>
          Thanks, {contact.name}. We'll contact you to discuss your project.
        </p>
      </div>
    );
  }

  const totalQuestionSteps = config.questions.length;

  const isContactStep = currentStep === totalQuestionSteps;

  const totalSteps = totalQuestionSteps + 1;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const question = config.questions[currentStep];

  const handleAnswerChange = (value) => {
    setValidationError("");

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [question.key]: value,
    }));
  };

  const handleContactChange = (field, value) => {
    setValidationError("");

    setContact((previousContact) => ({
      ...previousContact,
      [field]: value,
    }));
  };

  const validateQuestion = () => {
    const value = answers[question.key];

    if (question.required && !value) {
      return "Please provide an answer.";
    }

    if (question.type === "number" && value) {
      const numberValue = Number(value);

      if (Number.isNaN(numberValue)) {
        return "Please enter a valid number.";
      }

      if (question.min !== null && numberValue < question.min) {
        return `Value must be at least ${question.min}.`;
      }

      if (question.max !== null && numberValue > question.max) {
        return `Value must be no more than ${question.max}.`;
      }
    }

    return "";
  };

  const validateContact = () => {
    if (!contact.name.trim()) {
      return "Please enter your name.";
    }

    if (!contact.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (contact.email && !contact.email.includes("@")) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleNext = () => {
    const errorMessage = validateQuestion();

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    setValidationError("");

    setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    setValidationError("");
    setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    const errorMessage = validateContact();

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");

      const leadResponse = await submitLead({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        answers,
      });

      setEstimate({
        estimate_low: Number(leadResponse.lead.estimate_low),
        estimate_high: Number(leadResponse.lead.estimate_high),
      });
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Northline Roofing & Exteriors</h1>

      <p>
        Step {currentStep + 1} of {totalSteps}
      </p>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#111827",
            borderRadius: "999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {!isContactStep && (
        <>
          <h2>{question.label}</h2>

          {question.type === "number" && (
            <>
              <input
                type="number"
                value={answers[question.key] || ""}
                min={question.min ?? undefined}
                max={question.max ?? undefined}
                placeholder={question.unit || ""}
                onChange={(event) => handleAnswerChange(event.target.value)}
              />

              {question.unit && <span>{question.unit}</span>}
            </>
          )}

          {question.type === "select" && (
            <select
              value={answers[question.key] || ""}
              onChange={(event) => handleAnswerChange(event.target.value)}
            >
              <option value="">Select an option</option>

              {question.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {validationError && <p>{validationError}</p>}

          <div>
            {currentStep > 0 && <button onClick={handleBack}>Back</button>}

            <button onClick={handleNext}>Next</button>
          </div>
        </>
      )}

      {isContactStep && (
        <>
          <h2>Get Your Estimate</h2>

          <input
            type="text"
            placeholder="Your name"
            value={contact.name}
            onChange={(event) =>
              handleContactChange("name", event.target.value)
            }
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={contact.phone}
            onChange={(event) =>
              handleContactChange("phone", event.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email address"
            value={contact.email}
            onChange={(event) =>
              handleContactChange("email", event.target.value)
            }
          />

          {validationError && <p>{validationError}</p>}

          <div>
            <button onClick={handleBack} disabled={isSubmitting}>
              Back
            </button>

            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Calculating..." : "Get My Estimate"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
