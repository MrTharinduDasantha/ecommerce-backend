const SecurityPolicy = () => {
  return (
    <>
    <div className="max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Security Policy</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Organizational Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We have an Information Security Management System (ISMS) aligned with our objectives and risk assessments.</li>
          <li>Employees undergo background checks including criminal records, employment history, and education.</li>
          <li>All employees sign confidentiality and acceptable use agreements and receive role-specific security training.</li>
          <li>Our dedicated security and privacy team manages the security and privacy programs.</li>
          <li>All business mobile devices are enrolled in a Mobile Device Management system for compliance.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Infrastructure Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Network Security:</strong> We use firewalls and layered protection strategies, monitored regularly.</li>
          <li><strong>Network Redundancy:</strong> Distributed grid architecture provides failover and redundancy support.</li>
          <li><strong>Intrusion Detection & Prevention:</strong> Host and network-level signals are logged and monitored.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All changes go through secure SDLC processes, including secure coding, code analysis, and reviews.</li>
          <li>Customer data is logically separated to prevent unauthorized access.</li>
          <li>Data in transit is encrypted using secure protocols.</li>
          <li>Data is retained only while the account is active. After termination, it is permanently deleted after 3 months.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Identity and Access Control</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Multi-factor authentication is enabled for users.</li>
          <li>Access control is based on roles and the principle of least privilege.</li>
          <li>Internal policies prevent unauthorized employee access to user data.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Operational Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>System logs and internal traffic are continuously monitored for anomalies.</li>
          <li>Daily incremental and weekly full backups are taken and retained for 3 months.</li>
          <li>Customers can request recovery within the backup retention period.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Incident Management</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We notify customers about applicable incidents and recommend actions.</li>
          <li>Incidents are tracked, documented, and resolved with corrective actions.</li>
          <li>We notify Data Protection Authorities of any breaches as per regional law timelines.</li>
        </ul>
      </section>
    </div>
    </>
  );
};

export default SecurityPolicy;
