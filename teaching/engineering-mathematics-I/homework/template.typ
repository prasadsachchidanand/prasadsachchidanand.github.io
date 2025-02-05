
#let problem_counter = counter("problem")

#let prob(body) = {
  // let current_problem = problem_counter.step()
  [== Problem #problem_counter.step() #problem_counter.display()]
  block(fill:rgb(250, 255, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(199,31, 31),
   body)
  }

#let soln(body) = {
  // let current_solution = solution_counter.step()
  [== Solution ]
  block(fill:rgb(250, 255, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(31, 199, 31),
   body)
  }

 #let instruction(body) = {
  // let current_problem = problem_counter.step()
  [== Instruction]
  block(fill:rgb(245, 245, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(53,182,208),
   body)
  } 

 #let theory(body) = {
  // let current_problem = problem_counter.step()
  [== Theory]
  block(fill:rgb(245, 245, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(53,182,208),
   body)
  } 

 #let facts(body) = {
  // let current_problem = problem_counter.step()
  [== Facts]
  block(fill:rgb(245, 245, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(21,161,9),
   body)
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
    header: locate( 
        loc => if (
            counter(page).at(loc).first()==1) { none } 
        else if (counter(page).at(loc).first()==2) { align(right, 
              [*#author* | *#course_id: #title*]
            ) }
        else { 
            align(right, 
              [*#author* | *#course_id: #title*]
            ) 
        }
    ), 
    footer: locate(loc => {
      let page_number = counter(page).at(loc).first()
      let total_pages = counter(page).final(loc).last()
      align(center)[Page #page_number of #total_pages]
    }))
  block(height:25%,fill:none)
  align(center, text(17pt)[
    *#course_id: #title*])
  align(center, text(10pt)[
    Based on #prob_type])
  align(center, [_Dr. #professor_name _])
  
  
  pagebreak(weak: false)
  body
  
    // locate(loc => {
    //   let i = counter(page).at(loc).first()
    //   if i == 1 { return }
    //   set text(size: script-size)
    //   grid(
    //     columns: (6em, 1fr, 6em),
    //     if calc.even(i) [#i],
    //     align(center, upper(
    //       if calc.odd(i) { title } else { author-string }
    //     )),
    //     if calc.odd(i) { align(right)[#i] }
    //   )
    // })

//   if student_number != none {
//     align(top + left)[Student number: #student_number]
//   }

//   align(center)[= #title]
}

#let theoremBackground(color: black, body) = {
  set text(fill: white, weight: "bold")
  style(styles => {
    let size = measure(body, styles)
    let inset = 8pt
    [#block()[
      #polygon(
        fill: color,
        (0pt, 0pt),
        (0pt, size.height + (2*inset)),
        (size.width + (2*inset), size.height + (2*inset)),
        (size.width + (2*inset) + 6pt, 0cm)
      )
      #place(center + top, dy: size.height, dx: -3pt)[#body]
    ]]
  })
}

#let theoremBox(title: "title", color: none, radius: 0pt, width: auto, body) = {

  let strokeColor = luma(70)
  let backgroundColor = white

  if color == "red" {
    strokeColor = rgb(237, 32, 84)
    backgroundColor = rgb(253, 228, 224)
  } else if color == "green" {
    strokeColor = rgb(102, 174, 62)
    backgroundColor = rgb(235, 244, 222)
  } else if color == "blue" {
    strokeColor = rgb(29, 144, 208)
    backgroundColor = rgb(232, 246, 253)
  }

  return box(
    fill: backgroundColor,
    stroke: 1pt + strokeColor,
    radius: radius,
    width: width,
  )[
    #theoremBackground(color: strokeColor)[#title]
    #block(
      width: 100%,
      inset: (top: -2pt, x: 10pt, bottom: 10pt)
    )[
      #body
    ]
  ]
}