<Prompt Template>
{{{inputPrompt}}}
</Prompt Template>
    
Your job is to construct {{{number}}} test case for the prompt template above. This template contains "variables", which are placeholders to be filled in later. In this case, the variables are:
    
<variables>
{{#variableKeys}}
{{{.}}}
{{/variableKeys}}
</variables>

{{#examples.0.0}}
Here are the existing test cases provided by the user.
<examples>
{{#examples}} 
<example>
<variables>
{{#.}}
<{{key}}>{{{value}}}</{{key}}>
{{/.}}
</variables>
</example>
{{/examples}}
</examples>
{{/examples.0.0}}

First, in <planning> tags, do the following:
    
1. Summarize the prompt template. What is the goal of the user who created it?
2. For each variable in <variables>, carefully consider what a paradigmatic, realistic example of that variable would look like. You'll want to note who will be responsible "in prod" for supplying values. Written by a human "end user"? Downloaded from a website? Extracted from a database? Think about things like length, format, and tone in addition to semantic content. Use the existing test cases provided by the user to guide this exercise. The example you write should be drawn from that same distribution, but sufficiently different from the test cases that it provides additional signal.  A tricky balancing act, but I have faith in you.
    
Once you're done, output {{{number}}} test cases for this prompt template with a full, complete, value for each variable. The output format should consist of a tagged block for each variable, with the value inside the block, like the below:

<planning>
1. Summary of the prompt template:
[Summary of the prompt template]
2. Consideration of variables:
[Describe what a paradigmatic, realistic example of that variables would look like]
</planning>

<variables>
{{#variableKeys}}
<{{.}}>
[a full, complete, value for the variable "{{.}}". (You do not need to repeat the variable name inside the tags.)]
</{{.}}>
{{/variableKeys}}
</variables>