
library(devtools)
library(htmlwidgets)


devtools::install()
library(bubbleCloud)


data <- read.csv("inst/data/bubbles.csv")
data2 <- data[1:50,]
bubbles(data)
bubbles(data2[c("cluster")])

bubbles(data2[,2:4])
bubbles(data2[,2:4])

data3 <- data
data3$cluster <- 0
bubbles(data3)


d <- data.frame(groupo=sample(seq(1:6)-1,50, replace=TRUE))
is.null(d$group)

data <- data.frame(grou=sample(seq(1:6)-1,50, replace=TRUE))
is.null(data$group)

bubbles(data)


df <- read.csv("inst/data/tags.csv")
df <- df[c("tagL1")]
names(df) <- "group"
data <- df
bubbles(data)


renderBubbles(d)




