package main

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"net/http"
)

var client *redis.Client
var ctx = context.Background()

func main() {

	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	router := gin.Default()
	router.POST("/ip/go/sha256", convertToSHA)
	router.GET("/ip/go/sha256", getInformationAboutString)
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"code": "PAGE_NOT_FOUND"})
	})
	err := router.Run("localhost:8080")
	if err != nil {
		return
	}
}

func encryptPassword(password string) string {
	h := sha256.New()
	h.Write([]byte(password))
	b := h.Sum(nil)
	return base64.StdEncoding.EncodeToString(b)
}

func getInformationAboutString(context *gin.Context) {

	val, err := client.Get(ctx, context.DefaultQuery("hash", "null")).Result()
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"code": "HASH_NOT_FOUND"})
		return
	}
	context.IndentedJSON(http.StatusFound, gin.H{"message": val})

}

func convertToSHA(context *gin.Context) {

	message := context.PostForm("message")
	hashed := encryptPassword(message)

	err := client.Set(ctx, hashed, message, 0).Err()
	if err != nil {
		panic(err)
	}

	context.IndentedJSON(http.StatusOK, gin.H{"hash": hashed, "message": message})

}
