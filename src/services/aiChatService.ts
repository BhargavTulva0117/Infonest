import { AIChatMessage, AIModelOption } from '../types';

const SYSTEM_PROMPT = `You are Cosmos AI, the resident intelligence of InfoNest — "Your Knowledge Universe".
You specialize in frontier computing:
- Autonomous reasoning models (Process-Supervised Reward Models, Tree-of-Thought, MCTS rollouts)
- Planetary-scale distributed systems (Kafka event meshes, Raft consensus, eBPF kernel observability)
- 3D spatial computing & WebGPU shaders
- Curated engineering roadmaps and pedagogical breakdowns

Style: Lavish, cyber-luxury, structured, and insightful. Format code snippets cleanly with language identifiers. Offer next steps or knowledge vault suggestions when relevant.`;

export interface SendMessageOptions {
  message: string;
  history: AIChatMessage[];
  apiKey?: string;
  model: AIModelOption;
  onChunk?: (chunk: string) => void;
}

export async function queryCosmosAI({
  message,
  history,
  apiKey,
  model,
  onChunk
}: SendMessageOptions): Promise<{
  content: string;
  codeSnippet?: { language: string; code: string };
  suggestedActions?: Array<{ label: string; actionType: 'vault' | 'trail' | 'copy'; payload?: any }>;
}> {
  // If user has supplied their own OpenAI API key, call official OpenAI API
  if (apiKey && apiKey.trim().startsWith('sk-')) {
    try {
      const apiModel = model === 'cosmos-reasoner-v1' ? 'gpt-4o' : model;
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-6).map(h => ({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.content
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: apiModel,
          messages,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated.';

      // Extract code block if present
      const codeBlockMatch = content.match(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
      let codeSnippet;
      if (codeBlockMatch) {
        codeSnippet = {
          language: codeBlockMatch[1] || 'typescript',
          code: codeBlockMatch[2].trim()
        };
      }

      return {
        content,
        codeSnippet,
        suggestedActions: [
          { label: 'Save Insight to Vault', actionType: 'vault' },
          { label: 'Add to Knowledge Trail', actionType: 'trail' }
        ]
      };
    } catch (err: any) {
      console.warn('OpenAI API call failed, falling back to Cosmos Reasoning Engine:', err);
      // Fall through to built-in knowledge generator
    }
  }

  // Built-in Frontier Knowledge Engine (Zero-API-key fallback with realistic stream)
  return generateFrontierResponse(message);
}

function generateFrontierResponse(prompt: string): Promise<{
  content: string;
  codeSnippet?: { language: string; code: string };
  suggestedActions?: Array<{ label: string; actionType: 'vault' | 'trail' | 'copy'; payload?: any }>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = prompt.toLowerCase();

      if (lower.includes('prm') || lower.includes('orm') || lower.includes('reasoning')) {
        resolve({
          content: `### 🧠 Process-Supervised (PRM) vs. Outcome-Supervised (ORM) Reward Models\n\nIn frontier reasoning architectures (like o1 and DeepSeek-R1), the choice of verifier dictates trajectory convergence:\n\n1. **Outcome-Supervised Reward Models (ORMs)**:\n   - Only evaluate the *final state* of a reasoning roll ($r(s_T)$).\n   - Prone to *false positives via faulty logic* (e.g. correct final arithmetic answer arrived at through erroneous intermediate steps).\n   - Incapable of guiding Monte Carlo Tree Search (MCTS) rollbacks.\n\n2. **Process-Supervised Reward Models (PRMs)**:\n   - Assign a scalar score $r(s_t, a_t)$ to *each individual reasoning step*.\n   - Pinpoints precisely where logic diverges, enabling backtracking to step $k-1$ without discarding valid prefixes.\n   - Yields up to **42% higher accuracy** on complex Olympiad-level mathematical proofs.`,
          codeSnippet: {
            language: 'python',
            code: `class StepVerifier:\n    def evaluate_trajectory(self, steps: list[str]) -> list[float]:\n        step_scores = []\n        for step in steps:\n            # Score transition probability under PRM\n            score = self.prm_head(step)\n            step_scores.append(score)\n            if score < 0.45:\n                # Trigger backtrack signal\n                break\n        return step_scores`
          },
          suggestedActions: [
            { label: 'Save PRM Comparison to Vault', actionType: 'vault' },
            { label: 'Explore PRM Lecture Drop', actionType: 'trail' }
          ]
        });
      } else if (lower.includes('kafka') || lower.includes('distributed') || lower.includes('roadmap')) {
        resolve({
          content: `### 🌐 4-Week Planetary Distributed Systems Curriculum\n\nCurated by **Marcus Vance** (@marcus_vance):\n\n- **Week 1: Storage Internals & Log Segments**\n  - Zero-copy I/O with \`sendfile()\` Linux syscalls\n  - Index offsets, time-indexes, and memory-mapped page cache\n- **Week 2: Partitioning & Rebalance Protocols**\n  - Incremental cooperative rebalance vs. eager stop-the-world\n  - Key hashing and partition skew mitigation\n- **Week 3: Consensus & High Availability**\n  - KRaft (Kafka Raft Metadata Mode) leader election\n  - In-sync replicas (ISR) and \`min.insync.replicas\` durability\n- **Week 4: Stream Meshes & eBPF Observability**\n  - Microsecond latency tracing with kernel probes\n  - Exactly-once semantics (EOS) with transactional producers`,
          codeSnippet: {
            language: 'bash',
            code: `# Verify KRaft cluster metadata quorum status\nbin/kafka-metadata-quorum.sh --bootstrap-server localhost:9092 describe --status`
          },
          suggestedActions: [
            { label: 'Adopt to My Goals (+150 KT)', actionType: 'trail' },
            { label: 'Save to System Design Vault', actionType: 'vault' }
          ]
        });
      } else if (lower.includes('pytorch') || lower.includes('gradient') || lower.includes('gpu')) {
        resolve({
          content: `### ⚡ Resolving PyTorch Gradient Checkpointing Memory Spikes\n\nGradient checkpointing trades compute for VRAM by discarding intermediate activations during forward passes and recomputing them during backprop.\n\n**Common Bottleneck:** Overlapping \`torch.utils.checkpoint\` with custom autograd functions that allocate tensors inside the closure.\n\n**Best Practice Solution:**\n- Set \`use_reentrant=False\` for lower overhead and compatibility with \`torch.compile\`.\n- Pin activation buffers using non-blocking CUDA streams.`,
          codeSnippet: {
            language: 'python',
            code: `import torch\nimport torch.utils.checkpoint as checkpoint\n\nclass TransformerBlock(torch.nn.Module):\n    def forward(self, x):\n        # use_reentrant=False avoids python frame overhead\n        return checkpoint.checkpoint(self._inner_forward, x, use_reentrant=False)`
          },
          suggestedActions: [
            { label: 'Copy Implementation', actionType: 'copy' },
            { label: 'Save to AI Vault', actionType: 'vault' }
          ]
        });
      } else {
        resolve({
          content: `### ✦ Cosmos Intelligence Analysis\n\nRegarding **"${prompt}"**:\n\nIn the InfoNest ecosystem, this ties directly into our core curriculum on distributed intelligence and modern software architecture.\n\n- **Key Takeaway:** Modular decomposition and verifiable step validation ensure scalability across both model reasoning and system backbones.\n- **Recommended Next Step:** Explore the related **Course Vault** lectures and join the upcoming **Orbit Room** session to discuss this live with community mentors.`,
          suggestedActions: [
            { label: 'Save Response to Vault', actionType: 'vault' },
            { label: 'Add to Knowledge Trail', actionType: 'trail' }
          ]
        });
      }
    }, 600);
  });
}
