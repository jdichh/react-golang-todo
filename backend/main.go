package main

import (
	"context"
	"fmt"
	"os"
    "log"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
    "net/http"
)

type todoItem struct {
    ID int `json:"id" bson:"_id"`
    Completed bool `json:"completed?"`
    Body string `json:"body"`
}

var collection *mongo.Collection

func main() {
    router := gin.Default()

    router.SetTrustedProxies(nil)

    router.GET("/", func(ctx *gin.Context) {
        ctx.IndentedJSON(http.StatusOK, gin.H{
            "message": "Server is running on port 8080",
        })
    })
    
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

    err = client.Ping(context.Background(), nil)

    if err != nil {
        log.Fatal("Mongo connection error: ", err)
    }

    fmt.Println("Established connection to MongoDB Atlas.")

    collection = client.Database("golang_db").Collection("todos")

    router.Run("localhost:8080")
}
