#let problem_counter = counter("problem")

#let problem_counter = counter("problem")

#let prob(body) = {
  problem_counter.step()
  let color = rgb(199, 31, 31)
  
  block(
    breakable: true,
    spacing: 1em,
  )[
    #block(
      fill: color.lighten(90%),
      width: 100%,
      inset: 8pt,
      stroke: color,
      radius: (top: 4pt),
      sticky: true,
    )[
      #context [*Problem #problem_counter.display()*]
    ]
    #block(
      // fill: color.lighten(80%),
      above: 0pt,
      inset: 12pt,
      width: 100%,
      below: -0.5pt,
      stroke: (top: none, bottom: none, rest: color),
      breakable: true,
    )[
      #body
    ]
    #block(
      // fill: color.lighten(80%),
      width: 100%,
      stroke: (top: none, rest: color),
      radius: (bottom: 4pt),
      above: -1pt,
      height: 4pt,
      inset: 12pt,
      breakable: false,
    )[]
  ]
}

#let soln(body) = {
  let color = rgb(31, 199, 31)
  
  block(
    fill: color.lighten(80%),
    inset: 12pt,
    width: 100%,
    radius: 4pt,
    spacing: 1em,
    stroke: color,
    breakable: true,
  )[
    *#underline[Solution] #box[#move(dy: -.1em)[:]]* #body
  ]
}

#let tips(body) = {
  let color = rgb(100, 10, 100)
  
  block(
    fill: color.lighten(80%),
    inset: 12pt,
    width: 100%,
    radius: 4pt,
    spacing: 1em,
    stroke: color,
    breakable: true,
  )[
    *#underline[Important Tips] #box[#move(dy: -.1em)[:]]* #body
  ]
}

#let conventions(body) = {
  let color = rgb(70, 130, 180)
  
  block(
    fill: color.lighten(80%),
    inset: 12pt,
    width: 100%,
    radius: 4pt,
    spacing: 1em,
    stroke: color,
    breakable: true,
  )[
    *#underline[Conventions] #box[#move(dy: -.1em)[:]]* #body
  ]
}

#let theory(body) = {
  let color = rgb(5, 156, 10)
  
  block(
    fill: color.lighten(90%),
    inset: 12pt,
    width: 100%,
    radius: 4pt,
    spacing: 1em,
    stroke: color,
    breakable: true,
  )[
    *Theory #box[#move(dy: -.1em)[:]]* #body
  ]
}

// Some math operators
#let prox = [#math.op("prox")]
#let proj = [#math.op("proj")]
#let argmin = [#math.arg]+[#math.min]

// Initiate the document title, author...
#let assignment_class(title, author, course_id, professor_name, semester, prob_type, body) = {
  set document(title: title, author: author)
  set page(
    paper:"us-letter", 
    header: context {
      if counter(page).get().first() == 1 { 
        none 
      } else if counter(page).get().first() == 2 { 
        align(right, [*#author* | *#course_id: #title*])
      } else { 
        align(right, [*#author* | *#course_id: #title*])
      }
    }, 
    footer: context {
      let page_number = counter(page).get().first()
      let total_pages = counter(page).final().first()
      align(center)[Page #page_number of #total_pages]
    })
  block(height:25%,fill:none)
  align(center, text(17pt)[
    *#course_id: #title*])
  align(center, text(10pt)[
    Based on #prob_type])
  align(center, [_Dr. #professor_name _])
  
  pagebreak(weak: false)
  body
}

#let bf(x) = $bold(upright(#x))$
#let to = $->$
#let GL(n,R) = $G L_#n (bb(#R))$
#let ip(x, y) = $lr(angle.l #x, #y angle.r)$
#let focus(content) = {
  text(fill: purple, style: "italic")[#content]
}
#let iff = $<=>$ 
#let cup = $union$