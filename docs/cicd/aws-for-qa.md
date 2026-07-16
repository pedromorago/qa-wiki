# AWS for QA (with a touch of Ansible)

The environments you test against increasingly live in the cloud. A QA doesn't need to be an AWS architect, but does need bearings: knowing **where the logs, the data and the artifacts are**, and moving through them without depending on anyone.

## The five services a QA actually touches

| Service | What it is | What a QA uses it for |
|---|---|---|
| **EC2** | Virtual machines | Where test environments (or the CI runner itself) usually run |
| **S3** | Object storage | Test reports, artifacts, datasets, evidence |
| **RDS** | Managed databases | Connecting to [validate data with SQL](/api-testing/sql-for-qa) |
| **CloudWatch** | Logs and metrics | Diagnosing *why* that E2E failed: the real error lives in the service log |
| **IAM** | Identities and permissions | Understanding what you can touch (and why you can't touch the rest) |

## The CLI: just enough to be autonomous

```bash
# Download the report the pipeline left behind
aws s3 cp s3://my-bucket/reports/run-1234/ ./reports --recursive

# Follow a service's logs live (the cloud's "docker logs")
aws logs tail /ecs/my-service --follow --since 15m

# Which environments are up?
aws ec2 describe-instances --filters "Name=tag:env,Values=qa" \
  --query "Reservations[].Instances[].[InstanceId,State.Name]"
```

`aws s3` and `aws logs tail` cover 80 % of a QA's day-to-day in AWS.

## Ideas worth internalizing

- **Credentials**: always temporary (SSO/roles) and never in the repo or in test code — the [Git doesn't forget](/cicd/git-for-qa) rule applies double here.
- **Least privilege**: if you can't touch production, that's on purpose. Ask for the role you need, not the master key.
- **Environments cost money**: an instance spun up "to try something" and forgotten is the classic leak. Ephemeral environments (created for the test, destroyed after) are the healthy pattern.
- **Regions**: resources live in one specific region; "I can't find the bucket" usually means "you're looking in the wrong region".

## And Ansible?

**Ansible** is a configuration automation tool: it describes in YAML (*playbooks*) the desired state of machines — which packages, which configuration, which services — and applies it **idempotently** (running it twice breaks nothing). It matters to a QA for one concrete reason: **test environments are often built with it**. When an environment "feels off", the playbook is the specification of how it should be — reading it is the fast way to know what to expect from the machine.

## Common mistakes

- **Asking for help before checking CloudWatch**: the reason for the failure is almost always in the service log, not in the test output.
- **Assuming the environment is the same as yesterday**: in the cloud, environments get recreated; verify version and configuration before reporting a "bug" that's a half-finished deployment.
- **Shared or hardcoded personal credentials** — no shortcut justifies this.

::: tip Key idea
In the cloud, a QA's autonomy comes down to two questions: can I reach the log of the service that failed? Can I reach my test's data and artifacts? With S3, CloudWatch and an RDS connection, the answer is yes.
:::

## References

- [AWS CLI documentation](https://docs.aws.amazon.com/cli/)
- [Ansible documentation](https://docs.ansible.com/)
