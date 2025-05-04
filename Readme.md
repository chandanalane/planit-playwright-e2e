# Automated UI Testing Framework with Playwright

## Project Overview
This repository implements a robust UI automation framework using [Playwright](https://playwright.dev/). It is designed following the **Page Object Model (POM)** to ensure reusability, scalability, and maintainability.

---

## Configurations

    baseURL: 'http://jupiter.cloud.planittesting.com',
    headless: false,
    timeout:50000
    browser : chromium ( But can be enabled other browsers or can pass through commandline)

## Tools required

1. Install Jenkins
2. Install Node.js, npm, Git, and Playwright on Jenkins node


## ✅ Key Features Implemented

- **Playwright with TypeScript** for end-to-end automation
- **Page Object Model (POM)** structure
- **Reusable utility functions** with retry logic
- **CI/CD Integration** with Jenkins
- **Robust error handling and dynamic waits**
- **Logging and reporting**
- **Modular test cases** for easy scaling

---

## 📋 Use Cases Automated

### 1. **Contact Form Tests**
- Error validation without inputs
- Form completion with dynamic values
- Success message validation

### 2. **Shopping Cart Tests**
- Add multiple products with quantity
- Validate unit price and subtotal
- Verify total amount matches sum of products

---

## 🛠️ Best Practices Followed

1. **Page Object Model (POM)** used throughout
2. **Retry utility** implemented for flaky element interactions
3. **Playwright’s dynamic waits** to avoid hard timeouts
4. **Reusable and modular scripts**
5. **Custom utility functions** for reliability
6. **Console logs and debug traces** during execution

---

## 🔁 CI/CD Integration with Jenkins

### Jenkins Setup
1. Install Jenkins
2. Install Node.js, npm, Git, and Playwright on Jenkins node
3. Configure a Jenkins pipeline using the included `Jenkinsfile`

### Jenkinsfile Summary
```groovy
pipeline {
  agent any
  tools {
    nodejs 'NodeJS'
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npx playwright install'
        sh 'npx playwright test'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'test-results/**/*.*', allowEmptyArchive: true
    }
  }
}
```

---

## 🚀 Getting Started

```bash
git clone git@github.com:chandanalane/planit-playwright-e2e.git
cd planit-playwright-e2e
npm install
npx playwright install
npx playwright test
```

---

## 🔍 Reporting & Debugging
- Add `console.log()` traces throughout the page functions
- Playwright test reports can be visualized via:
```bash
npx playwright show-report
```

---

## ✅ Key Inputs for Online Assessment (Best Practices Summary)

1. **Make use of Page-Object-Model (POM)**
2. **Ensure script development is re-usable in nature**
3. **Integrate with open-source CI/CD tooling (Jenkins)**
4. **Enable reporting and logging of traces** to validate and troubleshoot
5. **Follow best practices for script development** (modularity, clean code, retry logic, dynamic waits)

---

## 🧩 Project Structure
```
/pages
  HomePage.ts
  ContactPage.ts
  ShopPage.ts
/tests
  contact.test.ts
  shop.test.ts
/lib
  utils.ts
Jenkinsfile
README.md
document.html
```

---

## 📄 HTML Documentation
Also available in [`document.html`](document.html) with full descriptions, architecture diagrams, and detailed instructions.
