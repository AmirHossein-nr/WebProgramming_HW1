package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"hash/fnv"
	"net/http"
	"strconv"
)

var (
	ListenAddr = "localhost:8080"
)

var client redis.UniversalClient

func main() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	router := gin.Default()
	router.POST("/ip/go/sha256", convertToSHA)
	router.GET("/ip/go/sha256", getInformationAboutString)
	err := router.Run(ListenAddr)
	if err == nil {
		return
	}
}

func hash(s string) uint32 {
	h := fnv.New32a()
	_, err := h.Write([]byte(s))
	if err != nil {
		return 0
	}
	return h.Sum32()
}

func getInformationAboutString(context *gin.Context) {
	// This function is BUGGY !
	val, err := client.Get("2166136261").Result()
	if err != nil {
		fmt.Println(err)
	}
	context.IndentedJSON(http.StatusFound, gin.H{"message": val})
}

func convertToSHA(context *gin.Context) {
	hashed := hash(context.Param("message"))

	err := client.Set(strconv.Itoa(int(hashed)), context.Param("message"), 0).Err()
	if err != nil {
		fmt.Println(err)
	}
	context.IndentedJSON(http.StatusOK, gin.H{"hash": strconv.Itoa(int(hashed))})
}
