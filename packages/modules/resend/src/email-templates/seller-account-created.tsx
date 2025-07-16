interface EmailTemplateProps {
    data: {
        user_name: string
        store_name: string
        reset_password_url: string
    }
}

export const SellerAccountCreatedEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ data }) => {
    return (
        <div style={{
            maxWidth: 600,
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            color: '#222',
            background: '#fff',
            padding: 24,
            borderRadius: 10
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>
                Welcome to Mercur, {data.user_name}! <span role="img" aria-label="wave">👋</span>
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                Great news! Your seller account "{data.store_name}" has been created successfully on the Mercur marketplace.
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>
                To complete your account setup, please create your password by clicking the button below:
            </p>
            <div style={{ marginBottom: 24 }}>
                <a
                    href={data.reset_password_url}
                    style={{
                        display: 'inline-block',
                        padding: '12px 28px',
                        background: '#222',
                        color: '#fff',
                        borderRadius: 6,
                        textDecoration: 'none',
                        fontWeight: 600,
                        marginBottom: 8
                    }}
                >
                    Set Your Password
                </a>
                <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
                    If you can't click the button, here's your link: <br />
                    <span style={{ color: '#0070f3' }}>{data.reset_password_url}</span>
                </div>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                Once you've set your password, you'll be able to access the vendor panel to manage your products,
                orders, and store settings.
            </p>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
                You received this email because a seller account was created for you on the Mercur marketplace.<br />
                If you have any questions, please contact our support team.
            </div>
            <div style={{ marginTop: 32 }}>
                <div>Best regards,</div>
                <div style={{ fontWeight: 600 }}>The Mercur Team</div>
                <div style={{ color: '#888', marginTop: 4 }}>mercur.js</div>
            </div>
        </div>
    )
}
