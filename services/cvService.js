// cvService.js
const fs = require('fs');

class CVService {
    constructor() {
        this.filePath = "cvs.json";
    }

    // Helper function to read users from JSON file
    readCVs() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading CVs:', err);
            return [];
        }
    }

    // Helper function to write users to JSON file
    writeCVs(cvs) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(cvs, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing CVs:', err);
        }
    }

    // Get all users
    getAllCVs() {
        return this.readCVs();
    }

    // Get a user by ID
    getCVById(id) {
        const cvs = this.readCVs();
        return cvs.find(cv => cv.id === id);
    }

    // Create a new user
    createCV(newCV) {
        const cvs = this.readCVs();
        newCV.id = cvs.length ? cvs[cvs.length - 1].id + 1 : 1;
        cvs.push(newCV);
        this.writeCVs(cvs);
        return newCV;
    }

    // Update a user by ID
    updateCV(id, updatedCV) {
        const cvs = this.readCVs();
        const cvIndex = cvs.findIndex(cv => cv.id === id);
        if (cvIndex === -1) return null;

        updatedCV.id = id;
        cvs[cvIndex] = updatedCV;
        this.writeCVs(cvs);
        return updatedCV;
    }

    // Delete a user by ID
    deleteCV(id) {
        const cvs = this.readCVs();
        const cvIndex = cvs.findIndex(cv => cv.id === id);
        if (cvIndex === -1) return null;

        const deletedCV = cvs.splice(cvIndex, 1);
        this.writeCVs(cvs);
        return deletedCV[0];
    }
}

module.exports = CVService;
