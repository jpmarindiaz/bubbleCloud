#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
bubbleForceInfobox <- function(data,width = NULL, height = NULL) {

  name <- "bubbleForceInfobox"
  #   if(is.null(data$id)) data$id <- seq(1:nrow(data))

  if(!"data.frame" %in% class(data)) {
    stop("data must be a dataframe")
  }

  if(is.null(is.null(data$htmlinfo))){
    message("No node htmlinfo: using default")
    data$htmlinfo <- "<h1>This</h1> is some <strong>html</strong>"
  }

  if (is.null(data$x)){
    message("No node x position provided: using random value")
    data$x <- runif(nrow(data),1,400)
  }

  if (is.null(data$y)){
    message("No node y position provided: using random value")
    data$y <- runif(nrow(data),1,400)
  }

  if (is.null(data$radius)){
    message("No radius provided: using fixed value = 5")
    data$radius <- 5
  }

  if (is.null(data$group)){
    message("No group variable")
    data$cluster <- 0
  } else{
    data$cluster <- as.numeric(factor(data$group))-1
  }

  #if(is.null(opts$initInfobox)){
    initInfobox <- "Haz click en los nodos para ver detalles!"
  #}


  clusters <- ddply(data,.(cluster),function(r){
    r <- r[with(r,order(radius)),]
    head(r,1)
  })

  n <- nrow(data)
  m <- nrow(clusters)

  #   # Convert to array of objects
  #   data <- apply(data, 1,function(r){
  #     as.list(r)
  #   })
  #   names(data) <- NULL

  settings <- list(
    initInfobox = initInfobox
      )

  #   apply(data[,2:4], 1,function(r){
  #     message(r)
  #     #r <- head(data,1)
  #     as.list(r)
  #   })
  #
  #   r <- head(data,1)
  # as.list(r)
  #
  #   clusters <- apply(clusters, 1,function(r){
  #     as.list(r)
  #   })



  x = list(
    settings = settings,
    n = n,
    m = m,
    data = data,
    clusters = clusters
  )


  # create widget
  htmlwidgets::createWidget(
    name = name,
    x,
    width = width,
    height = height,
    package = 'bubbleCloud',
    sizingPolicy = htmlwidgets::sizingPolicy(
      viewer.padding = 0,
      browser.fill = TRUE
    )
  )
}

#' Widget output function for use in Shiny
#'
#' @export
bubbleInfoboxOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'bubbleForceInfobox', width, height, package = 'bubbleCloud')
}

#' Widget render function for use in Shiny
#'
#' @export
renderInfoboxBubbles <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, bubbleInfoboxOutput, env, quoted = TRUE)
}
