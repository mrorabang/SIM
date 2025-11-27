import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileWidget = ({ onVerify, onExpire, onError, resetKey }) => {
    return (
        <div className="mb-3">
            <div style={{ minHeight: '65px' }}>
                <Turnstile
                    siteKey={process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY}
                    onVerify={(token) => {
                        console.log('TurnstileWidget - onVerify called with token:', token);
                        onVerify(token);
                    }}
                    onExpire={() => {
                        console.log('TurnstileWidget - onExpire called');
                        onExpire && onExpire();
                    }}
                    onError={() => {
                        console.log('TurnstileWidget - onError called');
                        onError && onError();
                    }}
                    resetKey={resetKey}
                    options={{
                        theme: 'light',
                        size: 'normal',
                        retry: 'auto',
                        'retry-interval': 8000,
                        'refresh-expired': 'auto',
                        action: 'login',
                        appearance: 'always'
                    }}
                />
            </div>
        </div>
    );
};

export default TurnstileWidget;
