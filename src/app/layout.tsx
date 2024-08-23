// app/layout.tsx

import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="fr">
            <head>
                <title>Gestion des Contacts</title>
            </head>
            <body>
                <header>
                    <nav>
                        {/* Navigation bar */}
                    </nav>
                </header>
                <main>{children}</main>
                <footer>
                    {/* Footer */}
                </footer>
            </body>
        </html>
    );
};

export default Layout;
