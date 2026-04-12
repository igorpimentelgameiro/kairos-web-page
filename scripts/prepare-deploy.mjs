import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const frontendDistDir = path.join(rootDir, "frontend", "dist");
const rootDistDir = path.join(rootDir, "dist");
const rootAssetsDir = path.join(rootDir, "assets");
const rootIndexFile = path.join(rootDir, "index.html");
const rootViteSvgFile = path.join(rootDir, "vite.svg");

const requiredFiles = [
  path.join(frontendDistDir, "index.html"),
  path.join(frontendDistDir, "assets"),
];

for (const target of requiredFiles) {
  if (!fs.existsSync(target)) {
    throw new Error(
      `Build não encontrado em ${target}. Execute "npm run build" antes de preparar o deploy.`,
    );
  }
}

const removeIfExists = (targetPath) => {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
};

const copyRecursive = (sourcePath, destinationPath) => {
  fs.cpSync(sourcePath, destinationPath, { recursive: true });
};

removeIfExists(rootDistDir);
copyRecursive(frontendDistDir, rootDistDir);

for (const fileName of ["404.html", "_redirects", "CNAME"]) {
  const sourceFile = path.join(rootDir, fileName);
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, path.join(rootDistDir, fileName));
  }
}

removeIfExists(rootAssetsDir);
copyRecursive(path.join(frontendDistDir, "assets"), rootAssetsDir);
fs.copyFileSync(path.join(frontendDistDir, "index.html"), rootIndexFile);

const frontendViteSvgFile = path.join(frontendDistDir, "vite.svg");
if (fs.existsSync(frontendViteSvgFile)) {
  fs.copyFileSync(frontendViteSvgFile, rootViteSvgFile);
}

console.log("Deploy preparado: frontend/dist sincronizado com dist/ e artefatos publicados na raiz.");
