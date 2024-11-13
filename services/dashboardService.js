const dayjs = require("dayjs");
const fs = require("fs");

class DashboardService {
  constructor() {
    this.datasource = "db/dashboard.json";
    this.curriculumVitaeStoreFolder = "db/curriculum-vitae";
  }

  getCVUrl(fileName) {
    return `/db/curriculum-vitae/${fileName}`;
  }
  readDashboard() {
    try {
      const data = fs.readFileSync(this.datasource, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading dashboard:", err);
      return [];
    }
  }

  writeDashboard(dashboard) {
    try {
      fs.writeFileSync(this.datasource, JSON.stringify(dashboard, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing dashboard:", err);
    }
  }
  
  addCurriculumVita(user) {
    const dashboard = this.readDashboard();
    
    const cvFileName = `${user.CV.replace(/\s/g, "-")}.pdf`;
    //fs.writeFileSync(`${this.curriculumVitaeStoreFolder}/${cvFileName}`, cvFileBuffer);
    const updatedDashboard = [
      ...dashboard,
      {
        id: dashboard.length ? dashboard[dashboard.length - 1].id + 1 : 1,
        userId: user,
        cvFileName: cvFileName,
        dateAdded: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        dateModified: null,
      },
    ];
    this.writeDashboard(updatedDashboard);
    return updatedDashboard[updatedDashboard.length - 1];
  }

  getCurriculumVitaeByUserId(userId) {
    const dashboard = this.readDashboard();
    if (!dashboard || dashboard.length === 0) {
      return [];
    }
    return dashboard.find((cv) => cv.userId === userId);
  }

  getCurriculumVitaById(id) {
    const dashboard = this.readDashboard();
    return dashboard.find((cv) => cv.id === id);
  }

  updateCurriculumVita(id, cvFileBuffer) {
    const dashboard = this.readDashboard();
    const cvIndex = dashboard.findIndex((cv) => cv.id === id);
    if (cvIndex === -1) {
      console.error("Curriculum Vita not found");
      return;
    }

    const cv = dashboard[cvIndex];
    const cvFileName = cv.cvFileName;
    fs.writeFileSync(`${this.curriculumVitaeStoreFolder}/${cvFileName}`, cvFileBuffer);
    dashboard[cvIndex].dateModified = dayjs().format("YYYY-MM-DD HH:mm:ss");
    this.writeDashboard(dashboard);
    return dashboard[cvIndex];
  }

  deleteCurriculumVita(id) {
    const dashboard = this.readDashboard();
    if (!dashboard || dashboard.length === 0) {
      console.error("Dashboard is empty");
      return;
    }
    const cvIndex = dashboard.findIndex((cv) => cv.id === id);
    if (cvIndex === -1) {
      console.error("Curriculum Vita not found");
      return;
    }

    const cv = dashboard[cvIndex];
    fs.unlinkSync(`${this.curriculumVitaeStoreFolder}/${cv.cvFileName}`);
    dashboard.splice(cvIndex, 1);
    this.writeDashboard(dashboard);
    return cv;
  }
}

module.exports = DashboardService;
