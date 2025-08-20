import React from "react";
import "../style/x_app.css";

const TermsAndConditionsPage = () => {
    return (
        <div className="tx_terms_wrapper">
            {/* Header */}
            <header className="tx_header">
                <div className="tx_container">
                    <h1 className="tx_title">Terms & Conditions</h1>
                    <p className="tx_subtitle">
                        Please read these terms carefully before using our services.
                    </p>
                    <p className="tx_date">Effective date: 19/08/2025</p>
                </div>
            </header>

            <div className="tx_container">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="my-3">
                        {/* Table of contents */}
                        <section className="tx_toc_section tx_container">
                            <h2 className="tx_section_title">Table of Contents</h2>
                            <ul className="tx_toc_list">
                                <li><a href="#acceptance">Acceptance of Terms</a></li>
                                <li><a href="#eligibility">Eligibility & Accounts</a></li>
                                <li><a href="#use">Acceptable Use</a></li>
                                <li><a href="#privacy">Privacy & Data</a></li>
                                <li><a href="#ip">Intellectual Property</a></li>
                                <li><a href="#liability">Disclaimers & Liability</a></li>
                                <li><a href="#changes">Changes to the Service</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                            </ul>
                        </section>
                    </div>

                    <div className="my-3">
                        {/* Sections */}
                        <section id="acceptance" className="tx_section tx_container">
                            <h3>Acceptance of Terms</h3>
                            <p>
                                By accessing or using our services, you agree to be bound by these Terms & Conditions.
                                If you do not agree, you must refrain from using the Service.
                            </p>
                            <ul>
                                <li>These Terms constitute a legally binding agreement.</li>
                                <li>We may update Terms; continued use implies acceptance of changes.</li>
                                <li>We recommend reviewing this page periodically.</li>
                            </ul>
                        </section>        

                        <section id="eligibility" className="tx_section tx_container">
                            <h3>Eligibility & Accounts</h3>
                            <p>
                                You must be capable of forming a binding contract. You are responsible for
                                maintaining confidentiality of account credentials and activities.
                            </p>
                        </section>

                        <section id="use" className="tx_section tx_container">
                            <h3>Acceptable Use</h3>
                            <p>
                                You agree not to misuse the Service, including but not limited to:
                            </p>
                            <ul>
                                <li>No reverse engineering, scraping, or automated data harvesting.</li>
                                <li>No unlawful, harassing, or harmful behavior.</li>
                                <li>Respect intellectual property and privacy rights.</li>
                            </ul>
                        </section>

                        <section id="privacy" className="tx_section tx_container">
                            <h3>Privacy & Data</h3>
                            <p>
                                We process personal information as described in our Privacy Policy. You consent to
                                such processing and warrant that all provided data is accurate.
                            </p>
                        </section>

                        <section id="ip" className="tx_section tx_container">
                            <h3>Intellectual Property</h3>
                            <p>
                                All content, trademarks, logos, and software are owned by us or our licensors
                                and protected by law. You may not use them without prior consent.
                            </p>
                        </section>

                        <section id="liability" className="tx_section tx_container">
                            <h3>Disclaimers & Liability</h3>
                            <p>
                                The Service is provided "as is" without warranties of any kind. To the maximum
                                extent permitted by law, we disclaim all liability for indirect damages.
                            </p>
                        </section>

                        <section id="changes" className="tx_section tx_container">
                            <h3>Changes to the Service</h3>
                            <p>
                                We may modify, suspend, or discontinue any part of the Service at any time.
                            </p>
                        </section>

                        <section id="contact" className="tx_section tx_container">
                            <h3>Contact Us</h3>
                            <p>Questions about these Terms?</p>
                            <p>Email: support@example.com</p>
                            <p>Phone: +1 (555) 123-4567</p>
                        </section>

                        {/* Agreement */}
                        <section className="tx_agreement tx_container">
                            <label>
                                <input type="checkbox" /> I agree to the Terms & Conditions
                            </label>
                            <div className="tx_btn_group">
                                <button className="tx_btn tx_primary">I Agree</button>
                                <button className="tx_btn tx_secondary">Review Again</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
