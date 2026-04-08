import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Container,
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

export default function ApplyAccountPage() {
  const router = useRouter(); // Initialize router
  const { slug } = router.query;

  const displayTitle = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Job Application";

  return (
    <>
      <Head>
        <title>Apply - {displayTitle}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </Head>

      <div className="bg-light min-vh-100 pb-5">
        <Container style={{ maxWidth: "850px" }}>
          <div className="py-4">
            <button
              onClick={() => router.back()}
              className="btn btn-link text-decoration-none p-0 fw-bold small"
              style={{ color: "#0056b3" }}>
              <i className="bi bi-chevron-left me-1"></i> Torna a offerta di
              lavoro
            </button>
            <h4 className="mt-2 fw-normal">{displayTitle}</h4>
          </div>

          {/* PROGRESS STEPPER */}
          <div className="d-flex justify-content-between mb-5 position-relative">
            {[
              "Crea account/Accedi",
              "Mie informazioni",
              "Mia esperienza",
              "Rivedi",
            ].map((step, i) => (
              <div
                key={i}
                className="text-center position-relative"
                style={{ zIndex: 2, flex: 1 }}>
                <div
                  className={`rounded-circle mx-auto mb-2 ${i === 0 ? "bg-warning" : "bg-secondary"}`}
                  style={{
                    width: "18px",
                    height: "18px",
                    border: i === 0 ? "4px solid #fff" : "none",
                    boxShadow: i === 0 ? "0 0 0 2px #cfa144" : "none",
                  }}></div>
                <div
                  className={`small ${i === 0 ? "fw-bold text-dark" : "text-muted"}`}
                  style={{ fontSize: "11px" }}>
                  {step}
                </div>
              </div>
            ))}
            <hr
              className="position-absolute w-100"
              style={{ top: "8px", zIndex: 1, backgroundColor: "#dee2e6" }}
            />
          </div>

          <h2 className="text-center fw-bold mb-4">Crea account</h2>

          <Card
            className="border-0 shadow-sm p-4 p-md-5 mx-auto rounded-1"
            style={{ maxWidth: "600px" }}>
            <div className="mb-4 small text-muted border p-3 bg-light">
              <p className="fw-bold mb-1">Requisiti password:</p>
              <ul className="mb-0 ps-3">
                <li>Un carattere speciale, maiuscolo, e numerico</li>
                <li>Minimo 8 caratteri</li>
              </ul>
            </div>

            <Form>
              <FormGroup className="mb-3">
                <Label className="small fw-bold">Indirizzo e-mail *</Label>
                <Input
                  type="email"
                  required
                  className="rounded-0 border-secondary py-2"
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="small fw-bold">Password *</Label>
                <Input
                  type="password"
                  required
                  className="rounded-0 border-secondary py-2"
                />
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="small fw-bold">
                  Verifica nuova password *
                </Label>
                <Input
                  type="password"
                  required
                  className="rounded-0 border-secondary py-2"
                />
              </FormGroup>

              <div className="form-check mb-4 small text-muted">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacy"
                  required
                />
                <label className="form-check-label" htmlFor="privacy">
                  {" "}
                  I confirm that I have read the{" "}
                  <a href="#" className="text-primary">
                    privacy notice
                  </a>
                  .
                </label>
              </div>

              <Button
                className="w-100 py-2 fw-bold text-white border-0"
                style={{ backgroundColor: "#cfa144" }}>
                Crea account
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
}
