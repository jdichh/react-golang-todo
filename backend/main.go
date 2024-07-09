package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type todoItem struct {
    ID primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
    Completed bool `json:"completed?"`
    Body string `json:"body"`
}

var collection *mongo.Collection

func main() {
    router := gin.Default()
    router.SetTrustedProxies(nil)

    err := godotenv.Load(".env")

    if err != nil {
        log.Fatal("Error loading .env: ", err)
    }

    MONGODB_URI := os.Getenv("MONGODB_URI")
    clientOptions := options.Client().ApplyURI(MONGODB_URI)
    client, err := mongo.Connect(context.Background(), clientOptions)

    if err != nil {
       log.Fatal("Mongo connection error: ", err)
    }

    defer client.Disconnect(context.Background())

    err = client.Ping(context.Background(), nil)

    if err != nil {
        log.Fatal("Mongo connection error: ", err)
    }

    fmt.Println("Established connection to MongoDB Atlas.")

    collection = client.Database("golang_db").Collection("todos")

    router.GET("/api/todos", getTodos)
    router.POST("/api/todos", createTodo)
    router.PATCH("/api/todos/:id", updateTodo)
    router.DELETE("/api/todos/:id", deleteTodo)

    port := os.Getenv("PORT")
    
    if port == "" {
        port = "8080"
    }

    router.Run("localhost:8080")
}

func getTodos(ctx *gin.Context) {
    var todos []todoItem

    cursor, err := collection.Find(context.Background(), bson.M{})
    
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todos"})
        return
    }

    defer cursor.Close(context.Background())

    for cursor.Next(context.Background()) {
        var todo todoItem

        if err := cursor.Decode(&todo); err != nil {
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode todo"})
            return
        }

        todos = append(todos, todo)
    }

    if err := cursor.Err(); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cursor error"})
        return
    }

    ctx.JSON(http.StatusOK, todos)
}

func createTodo(ctx *gin.Context){
    todo := new(todoItem)

    if err := ctx.BindJSON(&todo); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    if todo.Body == "" {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Body cannot be empty"})
        return
    }

    insertItem, err := collection.InsertOne(context.Background(), todo)
    if err != nil {
        return
    }

    todo.ID = insertItem.InsertedID.(primitive.ObjectID)

    ctx.JSON(http.StatusCreated, todo)
}

func updateTodo(ctx *gin.Context){
    id := ctx.Param("id")
    ObjectID, err := primitive.ObjectIDFromHex(id)

    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error":"Invalid ID"})
        return
    }

    filter := bson.M{"_id": ObjectID}
    update := bson.M{
        "$set": bson.M{
            "completed": true,
        },
    }

    _, err = collection.UpdateOne(context.Background(), filter, update)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to update todo"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message":"Successfully updated todo item"})
    
}

func deleteTodo(ctx *gin.Context){
    id := ctx.Param("id")
    ObjectID, err := primitive.ObjectIDFromHex(id)

    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error":"Invalid ID"})
        return
    }

    filter := bson.M{"_id": ObjectID}

    _, err = collection.DeleteOne(context.Background(), filter)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to delete todo"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message":"Successfully deleted todo item"})
}
