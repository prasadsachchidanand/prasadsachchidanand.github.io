#let problem_counter = counter("problem")

#let prob(body) = {
  problem_counter.step()
  context [== Problem #problem_counter.display()]
  block(fill:rgb(250, 255, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(199,31, 31),
   body)
}

// Option 1: Using breakable: true (recommended)
#let soln(body) = {
  [== Solution ]
  block(fill:rgb(250, 255, 250),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(31, 199, 31),
   breakable: true,  // This allows the block to break across pages
   body)
}

// Option 2: Alternative approach using a styled container instead of block
#let soln_alt(body) = {
  [== Solution ]
  set block(fill: rgb(250, 255, 250), width: 100%, inset: 8pt, radius: 4pt, stroke: rgb(31, 199, 31))
  rect(
    fill: rgb(250, 255, 250),
    width: 100%,
    inset: 8pt,
    radius: 4pt,
    stroke: rgb(31, 199, 31),
    body
  )
}

// Option 3: Using a simple styling approach without blocks
#let soln_simple(body) = {
  [== Solution ]
  set par(first-line-indent: 0pt)
  pad(8pt, 
    rect(
      fill: rgb(250, 255, 250),
      width: 100%,
      inset: 8pt,
      radius: 4pt, 
      stroke: rgb(31, 199, 31),
      body
    )
  )
}

#let tips(body) = {
  [== Important Tips ]
  block(fill:rgb(255, 255, 186),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(100, 10, 100),
   breakable: true,  // Add this to other functions too
   body)
}

#let conventions(body) = {
  [== Conventions ]
  block(fill:rgb(240, 248, 255),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(70, 130, 180),
   breakable: true,
   body)
}

#let theory(body) = {
  [== Theory ]
  block(fill:rgb(247, 255, 251),
   width: 100%,
   inset:8pt,
   radius: 4pt,
   stroke:rgb(5, 156, 10),
   breakable: true,
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

#let bf(x) = $bold(#x)$
#let to = $->$
#let GL(n,R) = $G L_#n (bb(#R))$
#let ip(x, y) = $lr(angle.l #x, #y angle.r)$