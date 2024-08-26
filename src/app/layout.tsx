import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="fr">
            <head>
                <title>Contacts</title>
            </head>
            <body className="bg-gray-900 hover:bg-none">
                <main className="max-w-4xl mx-auto p-4">
                    {children}
                </main>
            </body>
        </html>
    );
};

export default Layout;
