import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import attackNotificationService from '../service/AttackNotificationService';

const AttackMonitor = () => {
    const [adminEmail, setAdminEmail] = useState('');
    const [emailEndpoint, setEmailEndpoint] = useState('');
    const [detectedBots, setDetectedBots] = useState([]);
    const [pendingNotifications, setPendingNotifications] = useState([]);
    const [testResult, setTestResult] = useState('');

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = () => {
        // Load detected bots
        const bots = JSON.parse(localStorage.getItem('detected_bots') || '[]');
        setDetectedBots(bots.reverse()); // Newest first

        // Load pending notifications
        const pending = JSON.parse(localStorage.getItem('pending_attack_notifications') || '[]');
        setPendingNotifications(pending.reverse());

        // Load saved settings
        const savedEmail = localStorage.getItem('admin_email') || '';
        const savedEndpoint = localStorage.getItem('email_endpoint') || '';
        setAdminEmail(savedEmail);
        setEmailEndpoint(savedEndpoint);
    };

    const saveSettings = () => {
        localStorage.setItem('admin_email', adminEmail);
        localStorage.setItem('email_endpoint', emailEndpoint);
        
        // Update service
        attackNotificationService.ADMIN_EMAIL = adminEmail;
        attackNotificationService.ATTACK_ENDPOINT = emailEndpoint;

        window.alert('Email settings saved successfully!');
    };

    const testEmailService = async () => {
        setTestResult('Testing...');
        try {
            await attackNotificationService.testEmailService();
            setTestResult('✅ Test email sent successfully!');
        } catch (error) {
            setTestResult(`❌ Test failed: ${error.message}`);
        }
    };

    const sendPendingNotifications = async () => {
        try {
            await attackNotificationService.sendPendingNotifications();
            loadStoredData(); // Refresh data
            setTestResult('✅ Pending notifications sent!');
        } catch (error) {
            setTestResult(`❌ Failed to send pending: ${error.message}`);
        }
    };

    const clearData = () => {
        if (window.confirm('Are you sure you want to clear all attack data?')) {
            localStorage.removeItem('detected_bots');
            localStorage.removeItem('pending_attack_notifications');
            loadStoredData();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <MDBContainer className="py-4">
            <h2 className="mb-4">
                <MDBIcon icon="shield-alt" className="me-2" />
                Attack Monitor & Email Settings
            </h2>

            <MDBRow className="mb-4">
                <MDBCol md="6">
                    <MDBCard>
                        <MDBCardBody>
                            <h5 className="mb-4">Email Notification Settings</h5>
                            
                            <MDBInput 
                                label="Admin Email"
                                type="email"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                className="mb-3"
                                placeholder="your-email@example.com"
                            />
                            
                            <MDBInput 
                                label="Email Endpoint (Formspree/EmailJS)"
                                type="text"
                                value={emailEndpoint}
                                onChange={(e) => setEmailEndpoint(e.target.value)}
                                className="mb-3"
                                placeholder="https://formspree.io/f/your-form-id"
                            />

                            <div className="d-flex gap-2 mb-3">
                                <MDBBtn color="primary" onClick={saveSettings}>
                                    <MDBIcon icon="save" className="me-1" />
                                    Save Settings
                                </MDBBtn>
                                
                                <MDBBtn color="info" onClick={testEmailService}>
                                    <MDBIcon icon="paper-plane" className="me-1" />
                                    Test Email
                                </MDBBtn>
                            </div>

                            {testResult && (
                                <div className={`alert ${testResult.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                    {testResult}
                                </div>
                            )}

                            <small className="text-muted">
                                <strong>Setup Instructions:</strong><br/>
                                1. Create Formspree account: <a href="https://formspree.io" target="_blank">formspree.io</a><br/>
                                2. Create new form<br/>
                                3. Copy form endpoint and paste above<br/>
                                4. Save settings and test
                            </small>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                <MDBCol md="6">
                    <MDBCard>
                        <MDBCardBody>
                            <h5 className="mb-4">System Status</h5>
                            
                            <div className="mb-3">
                                <strong>Detected Bots:</strong> {detectedBots.length}
                            </div>
                            
                            <div className="mb-3">
                                <strong>Pending Notifications:</strong> {pendingNotifications.length}
                            </div>

                            <div className="mb-3">
                                <strong>Email Service:</strong> 
                                {adminEmail && emailEndpoint ? (
                                    <span className="text-success ms-2">
                                        <MDBIcon icon="check-circle" /> Configured
                                    </span>
                                ) : (
                                    <span className="text-warning ms-2">
                                        <MDBIcon icon="exclamation-triangle" /> Not configured
                                    </span>
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                {pendingNotifications.length > 0 && (
                                    <MDBBtn color="warning" onClick={sendPendingNotifications}>
                                        <MDBIcon icon="send" className="me-1" />
                                        Send Pending ({pendingNotifications.length})
                                    </MDBBtn>
                                )}
                                
                                <MDBBtn color="danger" onClick={clearData}>
                                    <MDBIcon icon="trash" className="me-1" />
                                    Clear Data
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Recent Attacks Table */}
            {detectedBots.length > 0 && (
                <MDBCard>
                    <MDBCardBody>
                        <h5 className="mb-4">Recent Bot Attacks</h5>
                        
                        <MDBTable responsive>
                            <MDBTableHead>
                                <tr>
                                    <th>Time</th>
                                    <th>Reason</th>
                                    <th>User Agent</th>
                                    <th>Screen</th>
                                    <th>Actions</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {detectedBots.slice(0, 10).map((bot, index) => (
                                    <tr key={index}>
                                        <td>{formatTime(bot.timestamp)}</td>
                                        <td>
                                            <span className="badge bg-warning">
                                                {bot.reason}
                                            </span>
                                        </td>
                                        <td className="text-truncate" style={{maxWidth: '200px'}}>
                                            {bot.userAgent}
                                        </td>
                                        <td>{bot.screen?.width}x{bot.screen?.height}</td>
                                        <td>
                                            <MDBBtn 
                                                size="sm" 
                                                color="info"
                                                onClick={() => window.alert(JSON.stringify(bot, null, 2))}
                                            >
                                                <MDBIcon icon="eye" />
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </MDBCardBody>
                </MDBCard>
            )}
        </MDBContainer>
    );
};

export default AttackMonitor;
