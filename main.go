package main

import (
	"fmt"
	"log"
	"os"

	"github.com/bwmarrin/discordgo"
)

var Token string

// Este é o handler para quando o bot receber uma mensagem
func messageCreate(s *discordgo.Session, m *discordgo.MessageCreate) {
	// Ignorar mensagens do próprio bot
	if m.Author.ID == s.State.User.ID {
		return
	}

	// Responder ao comando !ping com "Pong!"
	if m.Content == "!ping" {
		s.ChannelMessageSend(m.ChannelID, "Pong!")
	}
}

func main() {
	// Pega o token do bot a partir da variável de ambiente
	Token = os.Getenv("DISCORD_TOKEN")
	if Token == "" {
		log.Fatal("Token do Discord não encontrado")
	}

	// Cria uma nova sessão do bot
	dg, err := discordgo.New("Bot " + Token)
	if err != nil {
		fmt.Println("Erro ao criar a sessão do bot:", err)
		return
	}

	// Adiciona um handler para a criação de mensagens
	dg.AddMessageCreateHandler(messageCreate)

	// Abre uma conexão com o WebSocket do Discord
	err = dg.Open()
	if err != nil {
		fmt.Println("Erro ao conectar ao Discord:", err)
		return
	}
	defer dg.Close()

	fmt.Println("Bot está ativo. Pressione Ctrl+C para sair.")

	// Espera até que o bot seja fechado
	select {}
}