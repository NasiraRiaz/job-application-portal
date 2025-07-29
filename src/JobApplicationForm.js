import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ProgressBar,
  Modal,
  Alert,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import "./JobApplicationForm.css";

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    cnic: "",
    educationLevel: "",
    skills: [],
    preferredRole: "",
    cv: null,
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      setFormData((prevData) => ({ ...prevData, cv: acceptedFiles[0] }));
      validateField("cv", acceptedFiles[0]);
    },
  });

  useEffect(() => {
    let completedFields = 0;
    const totalFields = 8;
    if (formData.fullName) completedFields++;
    if (formData.email) completedFields++;
    if (formData.phoneNumber) completedFields++;
    if (formData.cnic) completedFields++;
    if (formData.educationLevel) completedFields++;
    if (formData.skills.length > 0) completedFields++;
    if (formData.preferredRole) completedFields++;
    if (formData.cv) completedFields++;

    setProgress(Math.round((completedFields / totalFields) * 100));
  }, [formData]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "fullName":
        newErrors.fullName = value ? "" : "Full Name is required.";
        break;
      case "email":
        if (!value) {
          newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email is invalid.";
        } else {
          newErrors.email = "";
        }
        break;
      case "phoneNumber":
        newErrors.phoneNumber = value ? "" : "Phone Number is required.";
        break;
      case "cnic":
        if (!value) {
          newErrors.cnic = "CNIC is required.";
        } else if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) {
          newErrors.cnic = "CNIC must be in the format XXXXX-XXXXXXX-X.";
        } else {
          newErrors.cnic = "";
        }
        break;
      case "educationLevel":
        newErrors.educationLevel = value ? "" : "Education Level is required.";
        break;
      case "preferredRole":
        newErrors.preferredRole = value ? "" : "Preferred Role is required.";
        break;
      case "skills":
        newErrors.skills =
          value.length > 0 ? "" : "At least one skill must be selected.";
        break;
      case "cv":
        newErrors.cv = value ? "" : "CV is required.";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newSkills = checked
        ? [...formData.skills, value]
        : formData.skills.filter((skill) => skill !== value);
      setFormData({ ...formData, skills: newSkills });
      validateField("skills", newSkills);
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.cnic) newErrors.cnic = "CNIC is required.";
    if (!formData.educationLevel)
      newErrors.educationLevel = "Education Level is required.";
    if (formData.skills.length === 0)
      newErrors.skills = "At least one skill must be selected.";
    if (!formData.preferredRole)
      newErrors.preferredRole = "Preferred Role is required.";
    if (!formData.cv) newErrors.cv = "CV is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted Successfully:", formData);
      setSubmitted(true);
      setShowModal(true);
    } else {
      console.log("Form has validation errors.");
      setSubmitted(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      cnic: "",
      educationLevel: "",
      skills: [],
      preferredRole: "",
      cv: null,
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="form-wrapper">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8} lg={7}>
            <div className="form-container">
              <h2 className="text-center mb-2 form-title">
                Internship/Job Application
              </h2>
              <p className="text-center mb-4 form-subtitle">
                Please complete the form below to submit your application.
              </p>

              <ProgressBar
                now={progress}
                label={`${progress}% Completed`}
                className="mb-4"
              />

              {submitted && (
                <Alert variant="success" className="mt-3">
                  Application submitted successfully! Check the summary.
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group as={Row} className="mb-3" controlId="formFullName">
                  <Form.Label column sm={3}>Full Name</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      isInvalid={!!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm={3}>Email</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPhoneNumber">
                  <Form.Label column sm={3}>Phone Number</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formCnic">
                  <Form.Label column sm={3}>CNIC</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="cnic"
                      placeholder="XXXXX-XXXXXXX-X"
                      value={formData.cnic}
                      onChange={handleChange}
                      isInvalid={!!errors.cnic}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cnic}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formEducationLevel">
                  <Form.Label column sm={3}>Education Level</Form.Label>
                  <Col sm={9}>
                    <Form.Select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      isInvalid={!!errors.educationLevel}
                    >
                      <option value="">Select...</option>
                      <option value="High School">High School</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.educationLevel}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formSkills">
                  <Form.Label column sm={3}>Skills</Form.Label>
                  <Col sm={9} className="d-flex flex-wrap">
                    {["HTML", "CSS", "JavaScript", "React", "Node.js"].map((skill) => (
                      <Form.Check
                        inline
                        key={skill}
                        type="checkbox"
                        name="skills"
                        label={skill}
                        value={skill}
                        onChange={handleChange}
                        isInvalid={!!errors.skills}
                      />
                    ))}
                    {errors.skills && (
                      <div className="invalid-feedback d-block">
                        {errors.skills}
                      </div>
                    )}
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPreferredRole">
                  <Form.Label column sm={3}>Preferred Role</Form.Label>
                  <Col sm={9}>
                    <Form.Select
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleChange}
                      isInvalid={!!errors.preferredRole}
                    >
                      <option value="">Select...</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="QA Engineer">QA Engineer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.preferredRole}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formCv">
                  <Form.Label column sm={3}>Upload CV</Form.Label>
                  <Col sm={9}>
                    <div {...getRootProps({ className: `dropzone ${errors.cv ? "is-invalid" : ""}` })}>
                      <input {...getInputProps()} />
                      <p>
                        {formData.cv ? formData.cv.name : "Choose files or drag here"}
                      </p>
                    </div>
                    {errors.cv && (
                      <div className="invalid-feedback d-block">
                        {errors.cv}
                      </div>
                    )}
                  </Col>
                </Form.Group>

                <div className="text-center mt-4 d-flex justify-content-center gap-3">
                  <Button
                    variant="outline-danger"
                    type="button"
                    size="lg"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button className="btn-submit" type="submit" size="lg">
                    Submit Application
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="form-title">Application Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>CNIC:</strong> {formData.cnic}</p>
            <p><strong>Education Level:</strong> {formData.educationLevel}</p>
            <p><strong>Skills:</strong> {formData.skills.join(", ")}</p>
            <p><strong>Preferred Role:</strong> {formData.preferredRole}</p>
            <p><strong>CV:</strong> {formData.cv ? formData.cv.name : "Not Uploaded"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default JobApplicationForm;
