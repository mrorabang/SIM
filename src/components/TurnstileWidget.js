import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileWidget = ({ onVerify, onExpire, onError, resetKey }) => {
    return (
        <div className="mb-3">
            <div style={{ minHeight: '65px' }}>
                <Turnstile
                    siteKey={process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY}
                    onVerify={(token) => onVerify(token)}
                    onExpire={() => onExpire && onExpire()}
                    onError={() => onError && onError()}
                    resetKey={resetKey}
                    options={{
                        theme: 'light',
                        size: 'normal',
                        retry: 'auto',
                        'retry-interval': 8000,
                        'refresh-expired': 'auto'
                    }}
                />
            </div>
        </div>
    );
};

export default TurnstileWidget;
