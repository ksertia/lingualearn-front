
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "LinguaLearn API",
      "version": "1.0.0",
      "description": "API complète pour la plateforme LinguaLearn - Authentication, Users & Admin",
      "contact": {
        "name": "API Support",
        "email": "support@lingualearn.com"
      }
    },
    "servers": [
      {
        "url": "https://localhost:4000",
        "description": "Développement local (HTTPS)"
      },
      {
        "url": "https://213.32.120.11:4000",
        "description": "Production (VPS)"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "description": "JWT Authorization header using the Bearer scheme. Format: Bearer {token}"
        }
      },
      "schemas": {
        "UserRegistration": {
          "type": "object",
          "properties": {
            "firstName": {
              "type": "string",
              "example": "John"
            },
            "lastName": {
              "type": "string",
              "example": "Doe"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "user@example.com"
            },
            "phone": {
              "type": "string",
              "example": "+22670123456"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "password"
            },
            "username": {
              "type": "string",
              "example": null,
              "nullable": true
            },
            "accountType": {
              "type": "string",
              "enum": [
                "admin",
                "parent",
                "child",
                "teacher"
              ],
              "default": "parent"
            },
            "parentId": {
              "type": "string",
              "example": null,
              "nullable": true
            }
          },
          "required": [
            "firstName",
            "lastName",
            "password"
          ],
          "oneOf": [
            {
              "required": [
                "email"
              ]
            },
            {
              "required": [
                "phone"
              ]
            }
          ]
        },
        "UserLogin": {
          "type": "object",
          "properties": {
            "loginInfo": {
              "type": "string",
              "example": "user@example.com",
              "description": "Can be email, username, or phone number"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "password"
            }
          },
          "required": [
            "loginInfo",
            "password"
          ]
        },
        "ForgotPassword": {
          "type": "object",
          "properties": {
            "loginInfo": {
              "type": "string",
              "example": "user@example.com",
              "description": "Peut être email, username ou numéro de téléphone"
            }
          },
          "required": [
            "loginInfo"
          ]
        },
        "ResetPassword": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "example": "a1b2c3d4e5f6g7h8i9j0"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "password"
            }
          },
          "required": [
            "token",
            "password"
          ]
        },
        "VerifyAccount": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "example": "123456"
            }
          },
          "required": [
            "token"
          ]
        },
        "ChangePassword": {
          "type": "object",
          "properties": {
            "currentPassword": {
              "type": "string",
              "format": "password",
              "example": "Oldpassword"
            },
            "newPassword": {
              "type": "string",
              "format": "password",
              "example": "Newpassword"
            }
          },
          "required": [
            "currentPassword",
            "newPassword"
          ]
        },
        "RefreshToken": {
          "type": "object",
          "properties": {
            "refreshToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
          },
          "required": [
            "refreshToken"
          ]
        }
      }
    },
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "tags": [
      {
        "name": "Authentication",
        "description": "Endpoints d'authentification (inscription, connexion, etc.)"
      },
      {
        "name": "Users",
        "description": "Gestion du profil utilisateur"
      },
      {
        "name": "LearningPaths",
        "description": "Gestion des parcours (LearningPath)"
      },
      {
        "name": "Levels",
        "description": "Gestion des niveaux (Level)"
      },
      {
        "name": "Steps",
        "description": "Gestion des étapes (Step)"
      },
      {
        "name": "Exercises",
        "description": "Gestion des exercices (Exercise)"
      },
      {
        "name": "StepQuizzes",
        "description": "Gestion des quiz d'étape (StepQuiz)"
      },
      {
        "name": "AdminDashboard",
        "description": "Statistiques et état global de la plateforme"
      },
      {
        "name": "SubscriptionPlans",
        "description": "Gestion des plans d'abonnement"
      },
      {
        "name": "Subscriptions",
        "description": "Gestion des abonnements clients"
      },
      {
        "name": "MessagesWS",
        "description": "Messagerie temps réel (WebSocket)"
      },
      {
        "name": "Notifications",
        "description": "Gestion des notifications (REST + WebSocket)"
      },
      {
        "name": "Gamification",
        "description": "Gestion des badges et récompenses"
      }
    ],
    "paths": {
      "/api/v1/auth/register": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Register a new user",
          "description": "Create a new user account with email/phone and password",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserRegistration"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User successfully registered"
            },
            "400": {
              "description": "Bad request - invalid input"
            },
            "409": {
              "description": "Conflict - email or phone already exists"
            }
          }
        }
      },
      "/api/v1/auth/login": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Login user",
          "description": "Authenticate user with loginInfo (email, username, or phone) and password",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserLogin"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Login successful"
            },
            "401": {
              "description": "Unauthorized - invalid credentials"
            }
          }
        }
      },
      "/api/v1/auth/forgot-password": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Request password reset",
          "description": "Send a password reset link to the user's email or phone",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ForgotPassword"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Reset link sent to email/phone"
            }
          }
        }
      },
      "/api/v1/auth/reset-password": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Reset password",
          "description": "Reset user password with a valid reset token",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResetPassword"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password successfully reset"
            },
            "400": {
              "description": "Invalid or expired token"
            }
          }
        }
      },
      "/api/v1/auth/verify-account": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Verify user account",
          "description": "Verify user account with verification token",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VerifyAccount"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Account successfully verified"
            },
            "400": {
              "description": "Invalid verification token"
            }
          }
        }
      },
      "/api/v1/auth/refresh-token": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Refresh access token",
          "description": "Get a new access token using a refresh token",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RefreshToken"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "New access token generated"
            },
            "401": {
              "description": "Invalid refresh token"
            }
          }
        }
      },
      "/api/v1/auth/logout": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Logout user",
          "description": "Invalidate user session and tokens",
          "responses": {
            "200": {
              "description": "User successfully logged out"
            }
          }
        }
      },
      "/api/v1/auth/profile": {
        "get": {
          "tags": [
            "Authentication"
          ],
          "summary": "Get user profile",
          "description": "Get authenticated user's profile information",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User profile retrieved successfully"
            },
            "401": {
              "description": "Unauthorized - missing or invalid token"
            }
          }
        }
      },
      "/api/v1/auth/change-password": {
        "post": {
          "tags": [
            "Authentication"
          ],
          "summary": "Change password",
          "description": "Change authenticated user's password",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ChangePassword"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password successfully changed"
            },
            "400": {
              "description": "Current password is incorrect"
            },
            "401": {
              "description": "Unauthorized"
            }
          }
        }
      },
      "/api/v1/auth/check-auth": {
        "get": {
          "tags": [
            "Authentication"
          ],
          "summary": "Check authentication status",
          "description": "Verify if user is authenticated",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User is authenticated"
            },
            "401": {
              "description": "User is not authenticated"
            }
          }
        }
      },
      "/api/v1/users/me": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Get current user",
          "description": "Get the authenticated user's information",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User information retrieved successfully"
            },
            "401": {
              "description": "Unauthorized"
            }
          }
        },
        "put": {
          "tags": [
            "Users"
          ],
          "summary": "Update current user",
          "description": "Update the authenticated user's information",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string"
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User successfully updated"
            },
            "401": {
              "description": "Unauthorized"
            }
          }
        },
        "delete": {
          "tags": [
            "Users"
          ],
          "summary": "Delete current user",
          "description": "Delete the authenticated user's account",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User successfully deleted"
            },
            "401": {
              "description": "Unauthorized"
            }
          }
        }
      },
      "/api/v1/users": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Get all users",
          "description": "Get a list of all users (Admin only)",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of users retrieved successfully"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden - Admin access required"
            }
          }
        }
      },
      "/api/v1/users/stats": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Get user statistics",
          "description": "Get user statistics (Admin only)",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Statistics retrieved successfully"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden - Admin access required"
            }
          }
        }
      },
      "/api/v1/users/{id}": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Get user by ID",
          "description": "Get a specific user's information",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "User ID"
            }
          ],
          "responses": {
            "200": {
              "description": "User retrieved successfully"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User not found"
            }
          }
        },
        "put": {
          "tags": [
            "Users"
          ],
          "summary": "Update user by ID",
          "description": "Update a specific user's information",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "User ID"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "username": {
                      "type": "string"
                    },
                    "email": {
                      "type": "string",
                      "format": "email"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User successfully updated"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User not found"
            }
          }
        },
        "delete": {
          "tags": [
            "Users"
          ],
          "summary": "Delete user by ID",
          "description": "Delete a specific user's account",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "User ID"
            }
          ],
          "responses": {
            "200": {
              "description": "User successfully deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      },
      "/api/v1/learning-paths": {
        "post": {
          "summary": "Créer un nouveau parcours",
          "tags": [
            "LearningPaths"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "title",
                    "description"
                  ],
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Parcours créé"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/learning-paths": {
        "get": {
          "summary": "Récupérer tous les parcours",
          "tags": [
            "LearningPaths"
          ],
          "responses": {
            "200": {
              "description": "Liste des parcours"
            }
          }
        }
      },
      "/api/v1/learning-paths/{id}": {
        "get": {
          "summary": "Récupérer un parcours par ID",
          "tags": [
            "LearningPaths"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Parcours trouvé"
            },
            "404": {
              "description": "Parcours non trouvé"
            }
          }
        }
      },
      "/learning-paths/{id}": {
        "put": {
          "summary": "Mettre à jour un parcours",
          "tags": [
            "LearningPaths"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "code": {
                      "type": "string"
                    },
                    "thumbnailUrl": {
                      "type": "string"
                    },
                    "bannerUrl": {
                      "type": "string"
                    },
                    "colorCode": {
                      "type": "string"
                    },
                    "iconUrl": {
                      "type": "string"
                    },
                    "estimatedDurationWeeks": {
                      "type": "integer"
                    },
                    "isPublished": {
                      "type": "boolean"
                    },
                    "sortOrder": {
                      "type": "integer"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Parcours mis à jour"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Parcours non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un parcours",
          "tags": [
            "LearningPaths"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Parcours supprimé"
            },
            "404": {
              "description": "Parcours non trouvé"
            }
          }
        }
      },
      "/api/v1/steps": {
        "post": {
          "summary": "Créer une nouvelle étape",
          "tags": [
            "Steps"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "title",
                    "stepNumber",
                    "levelId"
                  ],
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "stepNumber": {
                      "type": "integer"
                    },
                    "levelId": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Étape créée"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        },
        "get": {
          "summary": "Récupérer toutes les étapes",
          "tags": [
            "Steps"
          ],
          "responses": {
            "200": {
              "description": "Liste des étapes"
            }
          }
        }
      },
      "/api/v1/steps/{id}": {
        "get": {
          "summary": "Récupérer une étape par ID",
          "tags": [
            "Steps"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Étape trouvée"
            },
            "404": {
              "description": "Étape non trouvée"
            }
          }
        },
        "put": {
          "summary": "Mettre à jour une étape",
          "tags": [
            "Steps"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "stepNumber": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Étape mise à jour"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Étape non trouvée"
            }
          }
        },
        "delete": {
          "summary": "Supprimer une étape",
          "tags": [
            "Steps"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Étape supprimée"
            },
            "404": {
              "description": "Étape non trouvée"
            }
          }
        }
      },
      "/api/v1/exercises": {
        "post": {
          "summary": "Créer un nouvel exercice",
          "tags": [
            "Exercises"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "lessonId",
                    "title",
                    "exerciseType",
                    "content"
                  ],
                  "properties": {
                    "lessonId": {
                      "type": "string"
                    },
                    "title": {
                      "type": "string"
                    },
                    "exerciseType": {
                      "type": "string",
                      "enum": [
                        "multiple_choice",
                        "fill_blank",
                        "matching"
                      ]
                    },
                    "instructions": {
                      "type": "string"
                    },
                    "content": {
                      "type": "object"
                    },
                    "correctAnswers": {
                      "type": "object"
                    },
                    "hints": {
                      "type": "object"
                    },
                    "explanation": {
                      "type": "string"
                    },
                    "points": {
                      "type": "integer"
                    },
                    "xpReward": {
                      "type": "integer"
                    },
                    "coinReward": {
                      "type": "integer"
                    },
                    "maxAttempts": {
                      "type": "integer"
                    },
                    "timeLimitSeconds": {
                      "type": "integer"
                    },
                    "sortOrder": {
                      "type": "integer"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Exercice créé avec succès"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/api/v1/exercises/{id}": {
        "get": {
          "summary": "Récupérer un exercice par ID",
          "tags": [
            "Exercises"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Exercice trouvé"
            },
            "404": {
              "description": "Exercice non trouvé"
            }
          }
        },
        "put": {
          "summary": "Modifier un exercice",
          "tags": [
            "Exercises"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Exercise"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Exercice modifié"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Exercice non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un exercice",
          "tags": [
            "Exercises"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Exercice supprimé"
            },
            "404": {
              "description": "Exercice non trouvé"
            }
          }
        }
      },
      "/api/v1/step-quizzes": {
        "post": {
          "summary": "Créer un nouveau quiz d'étape",
          "tags": [
            "StepQuizzes"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "stepId",
                    "title",
                    "questions"
                  ],
                  "properties": {
                    "stepId": {
                      "type": "string"
                    },
                    "title": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "questions": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "passingScore": {
                      "type": "integer"
                    },
                    "maxAttempts": {
                      "type": "integer"
                    },
                    "timeLimitMinutes": {
                      "type": "integer"
                    },
                    "xpReward": {
                      "type": "integer"
                    },
                    "coinReward": {
                      "type": "integer"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Quiz créé avec succès"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/api/v1/step-quizzes/{id}": {
        "get": {
          "summary": "Récupérer un quiz d'étape par ID",
          "tags": [
            "StepQuizzes"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Quiz trouvé"
            },
            "404": {
              "description": "Quiz non trouvé"
            }
          }
        },
        "put": {
          "summary": "Modifier un quiz d'étape",
          "tags": [
            "StepQuizzes"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/StepQuiz"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Quiz modifié"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Quiz non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un quiz d'étape",
          "tags": [
            "StepQuizzes"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Quiz supprimé"
            },
            "404": {
              "description": "Quiz non trouvé"
            }
          }
        }
      },
      "api/v1/admin/dashboard": {
        "get": {
          "summary": "Récupère les statistiques globales de l'application",
          "tags": [
            "AdminDashboard"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "startDate",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "description": "Date de début pour filtrer les utilisateurs (ISO)"
            },
            {
              "in": "query",
              "name": "endDate",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "description": "Date de fin pour filtrer les utilisateurs (ISO)"
            },
            {
              "in": "query",
              "name": "userType",
              "schema": {
                "type": "string",
                "enum": [
                  "admin",
                  "user",
                  "sub_account"
                ]
              },
              "description": "Type de compte utilisateur à filtrer"
            },
            {
              "in": "query",
              "name": "isActive",
              "schema": {
                "type": "boolean"
              },
              "description": "Filtrer par utilisateurs actifs"
            },
            {
              "in": "query",
              "name": "isVerified",
              "schema": {
                "type": "boolean"
              },
              "description": "Filtrer par utilisateurs vérifiés"
            },
            {
              "in": "query",
              "name": "withSubscription",
              "schema": {
                "type": "boolean"
              },
              "description": "Filtrer les utilisateurs ayant un abonnement"
            }
          ],
          "responses": {
            "200": {
              "description": "Statistiques globales",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "users": {
                            "type": "object",
                            "properties": {
                              "total": {
                                "type": "integer"
                              },
                              "active": {
                                "type": "integer"
                              },
                              "verified": {
                                "type": "integer"
                              },
                              "admin": {
                                "type": "integer"
                              },
                              "subAccounts": {
                                "type": "integer"
                              },
                              "withSubscription": {
                                "type": "integer"
                              }
                            }
                          },
                          "learningPaths": {
                            "type": "integer"
                          },
                          "levels": {
                            "type": "integer"
                          },
                          "steps": {
                            "type": "integer"
                          },
                          "lessons": {
                            "type": "integer"
                          },
                          "exercises": {
                            "type": "integer"
                          },
                          "stepQuizzes": {
                            "type": "integer"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/v1/subscription-plans": {
        "post": {
          "summary": "Créer un nouveau plan d'abonnement",
          "tags": [
            "SubscriptionPlans"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "planCode",
                    "planName",
                    "features"
                  ],
                  "properties": {
                    "planCode": {
                      "type": "string"
                    },
                    "planName": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "priceMonthly": {
                      "type": "number"
                    },
                    "priceYearly": {
                      "type": "number"
                    },
                    "currency": {
                      "type": "string"
                    },
                    "features": {
                      "type": "object"
                    },
                    "maxSubAccounts": {
                      "type": "integer"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Plan créé"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        },
        "get": {
          "summary": "Récupérer tous les plans d'abonnement",
          "tags": [
            "SubscriptionPlans"
          ],
          "responses": {
            "200": {
              "description": "Liste des plans"
            }
          }
        }
      },
      "/api/v1/subscription-plans/{id}": {
        "get": {
          "summary": "Récupérer un plan d'abonnement par ID",
          "tags": [
            "SubscriptionPlans"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Plan trouvé"
            },
            "404": {
              "description": "Plan non trouvé"
            }
          }
        },
        "put": {
          "summary": "Modifier un plan d'abonnement",
          "tags": [
            "SubscriptionPlans"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "planCode": {
                      "type": "string"
                    },
                    "planName": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "priceMonthly": {
                      "type": "number"
                    },
                    "priceYearly": {
                      "type": "number"
                    },
                    "currency": {
                      "type": "string"
                    },
                    "features": {
                      "type": "object"
                    },
                    "maxSubAccounts": {
                      "type": "integer"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Plan modifié"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Plan non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un plan d'abonnement",
          "tags": [
            "SubscriptionPlans"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Plan supprimé"
            },
            "404": {
              "description": "Plan non trouvé"
            }
          }
        }
      },
      "/api/v1/subscriptions": {
        "post": {
          "summary": "Créer un nouvel abonnement",
          "tags": [
            "Subscriptions"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "userId",
                    "planId",
                    "currentPeriodStart",
                    "currentPeriodEnd"
                  ],
                  "properties": {
                    "userId": {
                      "type": "string"
                    },
                    "planId": {
                      "type": "string"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "active",
                        "canceled",
                        "pending"
                      ]
                    },
                    "billingCycle": {
                      "type": "string",
                      "enum": [
                        "monthly",
                        "yearly"
                      ]
                    },
                    "currentPeriodStart": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "currentPeriodEnd": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "cancelAtPeriodEnd": {
                      "type": "boolean"
                    },
                    "canceledAt": {
                      "type": "string",
                      "format": "date-time"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Abonnement créé"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        },
        "get": {
          "summary": "Récupérer tous les abonnements",
          "tags": [
            "Subscriptions"
          ],
          "responses": {
            "200": {
              "description": "Liste des abonnements"
            }
          }
        }
      },
      "/api/v1/subscriptions/{id}": {
        "get": {
          "summary": "Récupérer un abonnement par ID",
          "tags": [
            "Subscriptions"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Abonnement trouvé"
            },
            "404": {
              "description": "Abonnement non trouvé"
            }
          }
        },
        "put": {
          "summary": "Modifier un abonnement",
          "tags": [
            "Subscriptions"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "enum": [
                        "active",
                        "canceled",
                        "pending"
                      ]
                    },
                    "billingCycle": {
                      "type": "string",
                      "enum": [
                        "monthly",
                        "yearly"
                      ]
                    },
                    "currentPeriodStart": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "currentPeriodEnd": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "cancelAtPeriodEnd": {
                      "type": "boolean"
                    },
                    "canceledAt": {
                      "type": "string",
                      "format": "date-time"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Abonnement modifié"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Abonnement non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un abonnement",
          "tags": [
            "Subscriptions"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Abonnement supprimé"
            },
            "404": {
              "description": "Abonnement non trouvé"
            }
          }
        }
      },
      "/api/v1/messages-ws": {
        "post": {
          "summary": "Envoyer un message (stockage + websocket)",
          "tags": [
            "MessagesWS"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "senderId",
                    "recipientId",
                    "content"
                  ],
                  "properties": {
                    "senderId": {
                      "type": "string"
                    },
                    "recipientId": {
                      "type": "string"
                    },
                    "content": {
                      "type": "string"
                    },
                    "type": {
                      "type": "string",
                      "enum": [
                        "text",
                        "image",
                        "file"
                      ]
                    },
                    "metadata": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Message envoyé"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/api/v1/messages-ws/conversation": {
        "get": {
          "summary": "Récupérer la conversation entre deux utilisateurs",
          "tags": [
            "MessagesWS"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "userA",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "userB",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Liste des messages"
            },
            "400": {
              "description": "Paramètres manquants"
            }
          }
        }
      },
      "/api/v1/notifications": {
        "post": {
          "summary": "Créer une notification (envoie aussi via WebSocket)",
          "tags": [
            "Notifications"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "userId",
                    "title",
                    "message"
                  ],
                  "properties": {
                    "userId": {
                      "type": "string"
                    },
                    "title": {
                      "type": "string"
                    },
                    "message": {
                      "type": "string"
                    },
                    "notificationType": {
                      "type": "string"
                    },
                    "iconUrl": {
                      "type": "string"
                    },
                    "actionUrl": {
                      "type": "string"
                    },
                    "isRead": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Notification créée"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/api/v1/notifications/user/{userId}": {
        "get": {
          "summary": "Récupérer les notifications d'un utilisateur",
          "tags": [
            "Notifications"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Liste des notifications"
            }
          }
        }
      },
      "/api/v1/notifications/{id}/read": {
        "put": {
          "summary": "Marquer une notification comme lue",
          "tags": [
            "Notifications"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Notification mise à jour"
            }
          }
        }
      },
      "/api/v1/notifications/{id}": {
        "delete": {
          "summary": "Supprimer une notification",
          "tags": [
            "Notifications"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Notification supprimée"
            }
          }
        }
      },
      "/api/v1/gamification/badges": {
        "post": {
          "summary": "Créer un badge",
          "tags": [
            "Gamification"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "badgeCode",
                    "badgeName"
                  ],
                  "properties": {
                    "badgeCode": {
                      "type": "string"
                    },
                    "badgeName": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "category": {
                      "type": "string"
                    },
                    "iconUrl": {
                      "type": "string"
                    },
                    "colorCode": {
                      "type": "string"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Badge créé"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        },
        "get": {
          "summary": "Récupérer tous les badges",
          "tags": [
            "Gamification"
          ],
          "responses": {
            "200": {
              "description": "Liste des badges"
            }
          }
        }
      },
      "/api/v1/gamification/badges/{id}": {
        "get": {
          "summary": "Récupérer un badge par ID",
          "tags": [
            "Gamification"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Badge trouvé"
            },
            "404": {
              "description": "Badge non trouvé"
            }
          }
        },
        "put": {
          "summary": "Modifier un badge",
          "tags": [
            "Gamification"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "badgeCode": {
                      "type": "string"
                    },
                    "badgeName": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "category": {
                      "type": "string"
                    },
                    "iconUrl": {
                      "type": "string"
                    },
                    "colorCode": {
                      "type": "string"
                    },
                    "isActive": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Badge modifié"
            },
            "400": {
              "description": "Données invalides"
            },
            "404": {
              "description": "Badge non trouvé"
            }
          }
        },
        "delete": {
          "summary": "Supprimer un badge",
          "tags": [
            "Gamification"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Badge supprimé"
            },
            "404": {
              "description": "Badge non trouvé"
            }
          }
        }
      },
      "/api/v1/gamification/user-badges": {
        "post": {
          "summary": "Attribuer un badge à un utilisateur",
          "tags": [
            "Gamification"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "userId",
                    "badgeId"
                  ],
                  "properties": {
                    "userId": {
                      "type": "string"
                    },
                    "badgeId": {
                      "type": "string"
                    },
                    "awardedAt": {
                      "type": "string",
                      "format": "date-time"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Badge attribué"
            },
            "400": {
              "description": "Données invalides"
            }
          }
        }
      },
      "/api/v1/gamification/user-badges/{userId}": {
        "get": {
          "summary": "Récupérer les badges d'un utilisateur",
          "tags": [
            "Gamification"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Liste des badges utilisateur"
            }
          }
        }
      }
    }
  },
  "customOptions": {
    "url": "/api-docs/swagger.json",
    "docExpansion": "none"
  }
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
