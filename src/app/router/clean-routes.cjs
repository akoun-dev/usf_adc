const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Extraction de la partie AUTHENTICATED_ROUTES
const startLabel = 'export const AUTHENTICATED_ROUTES: AppRouteConfig[] = [';
const startMatch = content.indexOf(startLabel);
if (startMatch === -1) {
    console.error('Could not find AUTHENTICATED_ROUTES');
    process.exit(1);
}

// Trouver la fin du tableau [ ... ]
let braceCount = 0;
let endMatch = -1;
for (let i = startMatch + startLabel.length - 1; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
        braceCount--;
        if (braceCount === 0) {
            endMatch = i;
            break;
        }
    }
}

if (endMatch !== -1) {
    const innerContent = content.substring(startMatch + startLabel.length, endMatch);
    
    // On sépare les objets { ... }
    const routes = [];
    let currentRoute = '';
    let objectBraceCount = 0;
    let started = false;

    for (let i = 0; i < innerContent.length; i++) {
        const char = innerContent[i];
        if (char === '{') {
            objectBraceCount++;
            started = true;
        }
        if (started) currentRoute += char;
        if (char === '}') {
            objectBraceCount--;
            if (objectBraceCount === 0) {
                routes.push(currentRoute.trim());
                currentRoute = '';
                started = false;
            }
        }
    }

    // Déduplication par path
    const uniqueRoutes = new Map();
    routes.forEach(route => {
        const pathMatch = route.match(/path:\s*["']([^"']+)["']/);
        if (pathMatch) {
            const routePath = pathMatch[1];
            if (!uniqueRoutes.has(routePath)) {
                uniqueRoutes.set(routePath, route);
            }
        } else if (route.includes('DashboardRouter')) {
            uniqueRoutes.set('/dashboard', route);
        } else if (route.includes('ProfilePage') && !route.includes('path:')) {
             // Cas particulier s'il manque le path (peu probable si c'est une route valide)
             uniqueRoutes.set('/profile-fallback', route);
        }
    });

    const cleanedRoutes = Array.from(uniqueRoutes.values()).join(',\n    ');
    const newRoutesContent = `${startLabel}\n    ${cleanedRoutes}\n]`;

    const newFullContent = content.substring(0, startMatch) + newRoutesContent + content.substring(endMatch + 1);
    fs.writeFileSync(filePath, newFullContent);
    console.log('Routes cleaned successfully. Total unique routes:', uniqueRoutes.size);
} else {
    console.error('Could not find end of AUTHENTICATED_ROUTES array');
}
