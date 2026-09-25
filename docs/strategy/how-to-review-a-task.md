# How to review a task

Review is where the team's quality is truly at stake: it's the last look before the merge. Two distinct processes: reviewing a feature ticket in the product team, and peer review between QAs.

## Reviewing a feature ticket

When development finishes (refined, developed, code-reviewed), the ticket moves to "To Review" and **any team member — dev or QA — can review it**. My flow:

1. **Assign the ticket to yourself** before starting — make it visible who's reviewing what.
2. **Understand the purpose** of the task. Reviewing without context is looking, not reviewing.
3. **Check the branch's pipeline**: development tests and QA tests. If the development ones fail, back to the developer — QA shouldn't spend time detecting what the automated gates already detect. Corollary: **don't assign QA a ticket with a red pipeline**.
4. **Run the test cases proposed by the developer** and add your own if you spot coverage gaps. As a QA, here I also review two more things: that the acceptance criteria are **covered by the developer's tests**, and whether any functional test of mine has become redundant because a development test already covers it — removing duplication is reviewing too.
5. **Problems?** Comment on the ticket **specifying the error** (not "it doesn't work") and re-test the fix.
6. **Closing**: once the ticket is validated, if there are no conflicts the reviewer merges; if there are, the reviewer records that it's validated and the developer resolves the conflicts and merges.
7. On delivery, **fill in the fix version**: knowing which version each change ships in is not optional.

## Peer review between QAs

The QA team's own tasks (automation framework, pipelines, documentation) also go through peer review — **every task, always**, even when there are default reviewers.

### The author prepares the review

Before putting the ticket in the review column (unassigned, so pending ones stay visible):

- **Pipeline run on their branch** — if the task includes tests, the evidence that they work goes up front.
- **Link to the case/suite in the test case manager** that it covers — the reviewer understands *what* is being covered.
- Any needed documentation or context, in the ticket.
- A heads-up in the team channel.

### The reviewer

1. **Self-assigns** and reacts to the channel message (visibility).
2. Checks three things: the code follows good practices; the pipeline passes; and — the one that gets forgotten — **the changes solve the problem described in the ticket**. Recommendation: pull the changes down and try them locally.
3. Changes needed? Native comments on the PR + "Changes requested" + reassign to the author. On complex tasks, a pair review speeds things up.
4. Closing: the reviewer **approves and merges**, fills in version and components, moves it to "Delivered" and unassigns themselves.

## The golden rule

> **Pending reviews take priority over starting new work.** Unblocking a teammate multiplies the team's throughput; your own task only speeds you up.

::: tip Key idea
A review isn't a formality before the merge: it's the check that the change solves the problem in the ticket, with evidence. A green pipeline tells you the tests pass — only the reviewer can tell you they're the right tests.
:::
