// MindLoop AI-Powered Learning Platform
// Complete JavaScript Implementation with Dark Mode

console.log('🧠 MindLoop AI Platform Initializing...');

// Application Configuration
const CONFIG = {
  APP_NAME: 'MindLoop',
  VERSION: '1.0.0',
  API_BASE_URL: 'http://localhost:3000/api',
  STORAGE_KEY: 'mindloop_data',
  THEME_KEY: 'mindloop_theme',
  SUPPORTED_FILES: ['.pdf', '.docx', '.txt', '.pptx', '.doc'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ANIMATION_DURATION: 300,
  NOTIFICATION_DURATION: 5000
};

// Theme Manager
class ThemeManager {
  constructor() {
    this.currentTheme = this.loadTheme();
    this.initializeTheme();
  }

  loadTheme() {
    return localStorage.getItem(CONFIG.THEME_KEY) || 'light';
  }

  initializeTheme() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Set up theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    this.currentTheme = theme;
    localStorage.setItem(CONFIG.THEME_KEY, theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Show notification
    NotificationManager.show(
      `Switched to ${newTheme} mode`, 
      'success'
    );
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Application State Management
class AppState {
  constructor() {
    this.data = this.loadData();
    this.listeners = {};
  }

  loadData() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    const defaultData = {
      user: {
        name: 'Student',
        level: 'Explorer',
        joinDate: new Date().toISOString(),
        preferences: {
          notifications: true,
          reminders: false,
          difficulty: 'adaptive',
          processingMode: 'thorough',
          theme: 'light'
        }
      },
      stats: {
        currentStreak: 7,
        longestStreak: 15,
        totalPoints: 2450,
        completedLevels: 12,
        processedDocs: 5,
        aiQuestions: 127,
        lastActivity: new Date().toDateString(),
        totalStudyTime: 24.5 // hours
      },
      documents: [],
      levels: [],
      achievements: [
        { id: 'first_steps', unlocked: true, unlockedAt: new Date().toISOString() },
        { id: 'week_warrior', unlocked: true, unlockedAt: new Date().toISOString() }
      ],
      activity: [
        { type: 'level_complete', text: 'Completed "Document Basics" level', time: '2 hours ago' },
        { type: 'upload', text: 'Uploaded "Study Guide.pdf"', time: '1 day ago' },
        { type: 'achievement', text: 'Earned "Week Warrior" achievement', time: '2 days ago' }
      ]
    };
    
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  }

  saveData() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
    this.emit('dataChanged', this.data);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  updateStats(updates) {
    Object.assign(this.data.stats, updates);
    this.saveData();
  }

  addDocument(doc) {
    this.data.documents.push({
      ...doc,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    });
    this.saveData();
  }

  addLevels(levels) {
    levels.forEach(level => {
      this.data.levels.push({
        ...level,
        id: level.id || Date.now().toString() + Math.random(),
        createdAt: new Date().toISOString()
      });
    });
    this.saveData();
  }

  addActivity(activity) {
    this.data.activity.unshift({
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    // Keep only last 10 activities
    if (this.data.activity.length > 10) {
      this.data.activity = this.data.activity.slice(0, 10);
    }
    this.saveData();
  }

  updateStreak() {
    const today = new Date().toDateString();
    if (this.data.stats.lastActivity !== today) {
      this.data.stats.currentStreak += 1;
      this.data.stats.longestStreak = Math.max(
        this.data.stats.longestStreak,
        this.data.stats.currentStreak
      );
      this.data.stats.lastActivity = today;
      this.data.stats.totalPoints += 50;
      this.saveData();
      return true;
    }
    return false;
  }
}

// AI Document Processor
class AIProcessor {
  constructor() {
    this.isProcessing = false;
  }

  async processDocument(file) {
    if (this.isProcessing) {
      throw new Error('Another document is currently being processed');
    }

    this.isProcessing = true;
    
    try {
      // Validate file
      this.validateFile(file);
      
      // Simulate AI processing
      const result = await this.simulateProcessing(file);
      
      return result;
    } finally {
      this.isProcessing = false;
    }
  }

  validateFile(file) {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!CONFIG.SUPPORTED_FILES.includes(extension)) {
      throw new Error(`Unsupported file type: ${extension}`);
    }
    
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
  }

  async simulateProcessing(file) {
    // Simulate AI processing delay
    await this.delay(2000 + Math.random() * 2000);
    
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const topicName = fileName.replace(/_/g, ' ').replace(/-/g, ' ');
    
    const levels = this.generateLevels(topicName);
    const totalQuestions = levels.reduce((sum, level) => sum + level.questions.length, 0);
    
    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      processingTime: (2 + Math.random() * 2).toFixed(1) + 's',
      confidence: (0.85 + Math.random() * 0.1).toFixed(2),
      levels: levels,
      totalQuestions: totalQuestions,
      keyTerms: this.generateKeyTerms(topicName),
      summary: this.generateSummary(topicName)
    };
  }

  generateLevels(topicName) {
    const baseId = Date.now();
    
    return [
      {
        id: `explorer_${baseId}_1`,
        name: `${topicName} - Fundamentals`,
        description: 'Master the basic concepts and terminology',
        difficulty: 'explorer',
        status: 'unlocked',
        estimatedTime: '15 min',
        points: 100,
        questions: this.generateQuestions('basic', topicName, 8)
      },
      {
        id: `explorer_${baseId}_2`,
        name: `${topicName} - Key Concepts`,
        description: 'Understand important ideas and relationships',
        difficulty: 'explorer',
        status: 'unlocked',
        estimatedTime: '20 min',
        points: 150,
        questions: this.generateQuestions('concepts', topicName, 10)
      },
      {
        id: `challenger_${baseId}_1`,
        name: `${topicName} - Applications`,
        description: 'Apply knowledge in practical scenarios',
        difficulty: 'challenger',
        status: 'locked',
        estimatedTime: '25 min',
        points: 200,
        questions: this.generateQuestions('application', topicName, 12)
      },
      {
        id: `masters_${baseId}_1`,
        name: `${topicName} - Mastery Challenge`,
        description: 'Demonstrate complete understanding',
        difficulty: 'masters',
        status: 'locked',
        estimatedTime: '30 min',
        points: 300,
        questions: this.generateQuestions('mastery', topicName, 6)
      }
    ];
  }

  generateQuestions(type, topic, count) {
    const questions = [];
    const questionTypes = {
      basic: 'multiple-choice',
      concepts: 'fill-blank',
      application: 'short-answer',
      mastery: 'essay'
    };

    for (let i = 0; i < count; i++) {
      questions.push({
        id: `q_${Date.now()}_${i}`,
        type: questionTypes[type],
        question: `${this.capitalize(type)} question ${i + 1} about ${topic}`,
        points: this.getQuestionPoints(type),
        difficulty: type,
        options: questionTypes[type] === 'multiple-choice' ? [
          'Correct answer',
          'Distractor A',
          'Distractor B',
          'Distractor C'
        ] : null,
        correctAnswer: questionTypes[type] === 'multiple-choice' ? 0 : null,
        explanation: `This question tests your ${type} understanding of ${topic}.`
      });
    }

    return questions;
  }

  generateKeyTerms(topic) {
    const terms = [
      `${topic} fundamentals`,
      `Core ${topic} concepts`,
      `${topic} methodology`,
      `${topic} applications`,
      `${topic} best practices`
    ];
    return terms.slice(0, 3 + Math.floor(Math.random() * 3));
  }

  generateSummary(topic) {
    return `This document covers essential aspects of ${topic}, providing comprehensive insights into key concepts, methodologies, and practical applications. The AI has identified multiple learning opportunities across different difficulty levels.`;
  }

  getQuestionPoints(type) {
    const pointMap = {
      basic: 10,
      concepts: 15,
      application: 20,
      mastery: 30
    };
    return pointMap[type] || 10;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Navigation Manager
class NavigationManager {
  constructor(appState) {
    this.appState = appState;
    this.currentPage = 'dashboard';
    this.initializeNavigation();
  }

  initializeNavigation() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      });
    }

    // Set initial page
    this.showPage('dashboard');
  }

  navigateToPage(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Show page
    this.showPage(page);
    
    // Close mobile menu
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar')?.classList.remove('active');
    }
  }

  showPage(page) {
    this.currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(pageEl => {
      pageEl.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(page);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Update page title and subtitle
    this.updatePageHeader(page);
    
    // Update page-specific content
    this.updatePageContent(page);
  }

  updatePageHeader(page) {
    const pageInfo = {
      dashboard: { 
        title: 'Dashboard', 
        subtitle: 'Welcome to your AI-powered learning journey' 
      },
      learn: { 
        title: 'Learn', 
        subtitle: 'Transform documents into interactive learning experiences' 
      },
      explorer: { 
        title: 'Explorer Levels', 
        subtitle: 'Master the fundamentals with beginner-friendly challenges' 
      },
      challenger: { 
        title: 'Challenger Levels', 
        subtitle: 'Test your knowledge with intermediate challenges' 
      },
      masters: { 
        title: 'Masters Arena', 
        subtitle: 'Prove your expertise with advanced scenarios' 
      },
      progress: { 
        title: 'Progress', 
        subtitle: 'Track your learning journey and achievements' 
      },
      achievements: { 
        title: 'Achievements', 
        subtitle: 'Celebrate your learning milestones' 
      },
      settings: { 
        title: 'Settings', 
        subtitle: 'Customize your learning experience' 
      }
    };

    const info = pageInfo[page] || pageInfo.dashboard;
    
    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    
    if (titleEl) titleEl.textContent = info.title;
    if (subtitleEl) subtitleEl.textContent = info.subtitle;
  }

  updatePageContent(page) {
    switch (page) {
      case 'dashboard':
        this.updateDashboard();
        break;
      case 'explorer':
      case 'challenger':
      case 'masters':
        this.updateLevelsPage(page);
        break;
      case 'progress':
        this.updateProgressPage();
        break;
      case 'achievements':
        this.updateAchievementsPage();
        break;
    }
  }

  updateDashboard() {
    const stats = this.appState.data.stats;
    
    // Update streak display
    const currentStreakEl = document.getElementById('current-streak');
    const longestStreakEl = document.getElementById('longest-streak');
    const totalPointsEl = document.getElementById('total-points');
    const headerStreakEl = document.getElementById('header-streak');
    
    if (currentStreakEl) currentStreakEl.textContent = stats.currentStreak;
    if (longestStreakEl) longestStreakEl.textContent = stats.longestStreak;
    if (totalPointsEl) totalPointsEl.textContent = stats.totalPoints.toLocaleString();
    if (headerStreakEl) headerStreakEl.textContent = stats.currentStreak;
    
    // Update streak progress
    const progressFill = document.getElementById('streak-progress-fill');
    if (progressFill) {
      const percentage = Math.min((stats.currentStreak / stats.longestStreak) * 100, 100);
      progressFill.style.width = `${percentage}%`;
    }
    
    // Update stat cards
    const completedLevels = document.getElementById('completed-levels');
    const processedDocs = document.getElementById('processed-docs');
    const aiQuestions = document.getElementById('ai-questions');
    
    if (completedLevels) completedLevels.textContent = stats.completedLevels;
    if (processedDocs) processedDocs.textContent = stats.processedDocs;
    if (aiQuestions) aiQuestions.textContent = stats.aiQuestions;
    
    // Update activity list
    this.updateActivityList();
  }

  updateActivityList() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const activities = this.appState.data.activity.slice(0, 5);
    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }

  getActivityIcon(type) {
    const icons = {
      level_complete: '🎯',
      upload: '📚',
      achievement: '🏆',
      streak: '🔥',
      study: '📖'
    };
    return icons[type] || '📝';
  }

  updateLevelsPage(difficulty) {
    const levelsGrid = document.getElementById(`${difficulty}-levels`);
    if (!levelsGrid) return;
    
    const userLevels = this.appState.data.levels.filter(level => 
      level.difficulty === difficulty
    );
    
    // If no user levels, keep static content
    if (userLevels.length === 0) return;
    
    // Add user-generated levels
    userLevels.forEach(level => {
      const levelCard = this.createLevelCard(level);
      levelsGrid.appendChild(levelCard);
    });
  }

  createLevelCard(level) {
    const card = document.createElement('div');
    card.className = `level-card ${level.status}`;
    card.dataset.level = level.id;
    
    card.innerHTML = `
      <div class="level-status">${level.status === 'unlocked' ? '🔓' : '🔒'}</div>
      <h4>${level.name}</h4>
      <p>${level.description}</p>
      <div class="level-meta">
        <span class="question-count">${level.questions?.length || 0} questions</span>
        <span class="time-estimate">${level.estimatedTime || '20 min'}</span>
      </div>
      ${level.progress ? `
        <div class="level-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${level.progress}%"></div>
          </div>
          <span class="progress-text">${level.progress}% Complete</span>
        </div>
      ` : ''}
      <div class="level-points">🏆 ${level.points || 100} points</div>
    `;
    
    card.addEventListener('click', () => this.startLevel(level));
    
    return card;
  }

  startLevel(level) {
    if (level.status === 'locked') {
      NotificationManager.show('This level is locked. Complete previous levels to unlock it.', 'warning');
      return;
    }
    
    NotificationManager.show(`Starting "${level.name}"! Full gameplay coming soon.`, 'info');
  }

  updateProgressPage() {
    console.log('Updating progress page...');
  }

  updateAchievementsPage() {
    console.log('Updating achievements page...');
  }
}

// File Upload Manager
class FileUploadManager {
  constructor(appState, aiProcessor) {
    this.appState = appState;
    this.aiProcessor = aiProcessor;
    this.selectedFiles = [];
    this.initializeUpload();
  }

  initializeUpload() {
    // Main upload form
    const uploadForm = document.getElementById('file-upload-form');
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
    }

    // Learn page upload
    const learnInput = document.getElementById('learn-file-input');
    if (learnInput) {
      learnInput.addEventListener('change', (e) => this.handleFileSelection(e, 'learn'));
    }

    // File input handling
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelection(e, 'main'));
    }

    // Drag and drop
    this.initializeDragAndDrop();
  }

  initializeDragAndDrop() {
    const dropZones = document.querySelectorAll('.file-input-wrapper');
    
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      
      zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
      });
    });
  }

  handleFileSelection(event, context = 'main') {
    const files = Array.from(event.target.files);
    this.processFiles(files, context);
  }

  processFiles(files, context = 'main') {
    // Validate and add files
    const validFiles = files.filter(file => {
      try {
        this.aiProcessor.validateFile(file);
        return true;
      } catch (error) {
        NotificationManager.show(`Invalid file "${file.name}": ${error.message}`, 'error');
        return false;
      }
    });

    if (validFiles.length === 0) return;

    // Add to selected files
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    
    // Update file list display
    this.updateFileList();
    
    // Auto-upload if from learn page
    if (context === 'learn') {
      this.uploadFiles(validFiles);
    }
  }

  updateFileList() {
    const fileList = document.getElementById('file-list');
    if (!fileList || this.selectedFiles.length === 0) return;

    fileList.innerHTML = this.selectedFiles.map((file, index) => `
      <div class="file-item">
        <div class="file-info">
          <div class="file-icon">${this.getFileIcon(file)}</div>
          <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${this.formatFileSize(file.size)}</div>
          </div>
        </div>
        <button type="button" class="remove-file" onclick="fileUploadManager.removeFile(${index})">
          ❌
        </button>
      </div>
    `).join('');
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    this.updateFileList();
  }

  async handleUpload(event) {
    event.preventDefault();
    
    if (this.selectedFiles.length === 0) {
      NotificationManager.show('Please select files to upload.', 'warning');
      return;
    }

    await this.uploadFiles(this.selectedFiles);
  }

  async uploadFiles(files) {
    const button = document.getElementById('upload-button');
    const statusElement = document.getElementById('upload-status');
    
    if (button) {
      button.classList.add('loading');
      button.disabled = true;
    }

    try {
      for (const file of files) {
        this.showStatus(`Processing ${file.name}...`, 'processing');
        
        const result = await this.aiProcessor.processDocument(file);
        
        if (result.success) {
          // Update app state
          this.appState.addDocument({
            name: file.name,
            size: file.size,
            type: file.type,
            processingTime: result.processingTime,
            questionsGenerated: result.totalQuestions
          });
          
          this.appState.addLevels(result.levels);
          
          this.appState.updateStats({
            processedDocs: this.appState.data.stats.processedDocs + 1,
            aiQuestions: this.appState.data.stats.aiQuestions + result.totalQuestions
          });
          
          this.appState.addActivity({
            type: 'upload',
            text: `Uploaded and processed "${file.name}"`,
            time: 'Just now'
          });
          
          // Update streak
          if (this.appState.updateStreak()) {
            NotificationManager.show('Streak updated! Keep up the great work!', 'success');
          }
          
          this.showStatus(
            `✅ Successfully processed "${file.name}"! Generated ${result.totalQuestions} questions across ${result.levels.length} levels.`,
            'success'
          );
          
          // Auto-navigate to explorer levels after 3 seconds
          setTimeout(() => {
            if (window.navigationManager) {
              window.navigationManager.navigateToPage('explorer');
            }
          }, 3000);
        }
      }
      
      // Clear selected files
      this.selectedFiles = [];
      this.updateFileList();
      
      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = '';
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      this.showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      if (button) {
        button.classList.remove('loading');
        button.disabled = false;
      }
    }
  }

  showStatus(message, type) {
    const statusElements = document.querySelectorAll('.upload-status');
    
    statusElements.forEach(element => {
      element.style.display = 'block';
      element.textContent = message;
      element.className = `upload-status ${type}`;
    });

    if (type === 'success') {
      setTimeout(() => {
        statusElements.forEach(element => {
          element.style.display = 'none';
        });
      }, 10000);
    }
  }

  getFileIcon(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      docx: '📝',
      doc: '📝',
      txt: '📃',
      pptx: '📊'
    };
    return icons[extension] || '📄';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Notification Manager
class NotificationManager {
  static show(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-message">${message}</div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    container.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }

  static success(message) {
    this.show(message, 'success');
  }

  static error(message) {
    this.show(message, 'error');
  }

  static warning(message) {
    this.show(message, 'warning');
  }

  static info(message) {
    this.show(message, 'info');
  }
}

// Settings Manager
class SettingsManager {
  constructor(appState, themeManager) {
    this.appState = appState;
    this.themeManager = themeManager;
    this.initializeSettings();
  }

  initializeSettings() {
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => this.handleSave(e));
      this.loadSettings();
    }
  }

  loadSettings() {
    const preferences = this.appState.data.user.preferences;
    
    // Load checkbox values
    const notifications = document.getElementById('notifications');
    const reminders = document.getElementById('reminders');
    
    if (notifications) notifications.checked = preferences.notifications;
    if (reminders) reminders.checked = preferences.reminders;
    
    // Load select values
    const difficulty = document.getElementById('difficulty');
    const processingMode = document.getElementById('processing-mode');
    
    if (difficulty) difficulty.value = preferences.difficulty;
    if (processingMode) processingMode.value = preferences.processingMode;
  }

  handleSave(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const preferences = {
      notifications: formData.has('notifications'),
      reminders: formData.has('reminders'),
      difficulty: formData.get('difficulty'),
      processingMode: formData.get('processing-mode'),
      theme: this.themeManager.getCurrentTheme()
    };
    
    // Update app state
    this.appState.data.user.preferences = preferences;
    this.appState.saveData();
    
    NotificationManager.success('Settings saved successfully!');
  }
}

// Application Initialization
class MindLoopApp {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    console.log('🚀 Initializing MindLoop Application...');
    
    // Initialize core managers
    this.themeManager = new ThemeManager();
    this.appState = new AppState();
    this.aiProcessor = new AIProcessor();
    
    // Initialize UI managers
    this.navigationManager = new NavigationManager(this.appState);
    this.fileUploadManager = new FileUploadManager(this.appState, this.aiProcessor);
    this.settingsManager = new SettingsManager(this.appState, this.themeManager);
    
    // Make managers globally available for debugging
    window.themeManager = this.themeManager;
    window.appState = this.appState;
    window.navigationManager = this.navigationManager;
    window.fileUploadManager = this.fileUploadManager;
    
    console.log('✅ MindLoop Application Initialized Successfully!');
    
    // Show welcome notification
    NotificationManager.show(
      `Welcome to MindLoop! Current theme: ${this.themeManager.getCurrentTheme()} mode`, 
      'info'
    );
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MindLoopApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MindLoopApp,
    ThemeManager,
    AppState,
    AIProcessor,
    NavigationManager,
    FileUploadManager,
    NotificationManager,
    SettingsManager
  };
}
