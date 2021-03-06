
library(devtools)
library(htmlwidgets)


document()
devtools::install()
library(bubbleCloud)


data <- read.csv("inst/data/bubbles.csv")

data$htmlInfo <- paste("<h1>someLorem ipsum dolor sit amet</h1>, consectetur adipisicing elit.",seq(1:nrow(data)))
data$hover <- paste("Cluster: ",data$cluster)
data$clusterLabel <- paste("clusterLabel: ",data$cluster)
data$group <- paste0("GRUPO ",data$cluster)
bubbleForceInfobox(data)




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




