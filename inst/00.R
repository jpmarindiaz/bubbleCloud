
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


#data <- data[,1]
#bubbles(data)

