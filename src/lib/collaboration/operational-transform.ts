/**
 * Operational Transform Engine for Real-time Collaborative Editing
 * 
 * This module implements sophisticated operational transforms for conflict-free
 * collaborative editing with real-time synchronization and advanced conflict resolution.
 */

import { Operation, OperationType, OperationTransform, ConflictType, OperationConflict } from '@/types.ts'

export class OperationalTransform {
  private static instance: OperationalTransform
  private transformRules: Map<string, TransformRule> = new Map()
  private conflictDetectors: Map<ConflictType, ConflictDetector> = new Map()

  static getInstance(): OperationalTransform {
    if (!OperationalTransform.instance) {
      OperationalTransform.instance = new OperationalTransform()
    }
    return OperationalTransform.instance
  }

  constructor() {
    this.initializeTransformRules()
    this.initializeConflictDetectors()
  }

  /**
   * Transform an operation against another operation
   */
  transform(op1: Operation, op2: Operation): TransformResult {
    const key = `${op1.type}-${op2.type}`
    const rule = this.transformRules.get(key)
    
    if (!rule) {
      return this.handleUnknownTransform(op1, op2)
    }

    try {
      const result = rule.transform(op1, op2)
      
      // Detect potential conflicts
      const conflicts = this.detectConflicts(op1, op2, result)
      
      return {
        op1Prime: result.op1Prime,
        op2Prime: result.op2Prime,
        conflicts,
        confidence: result.confidence || 1.0,
        metadata: {
          transformType: result.transformType,
          reason: result.reason,
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.error('Transform error:', error)
      return this.handleTransformError(op1, op2, error as Error)
    }
  }

  /**
   * Transform an operation against a list of operations
   */
  transformAgainst(operation: Operation, operations: Operation[]): Operation {
    let transformedOp = { ...operation }
    
    for (const againstOp of operations) {
      if (againstOp.timestamp <= operation.timestamp) {
        const result = this.transform(transformedOp, againstOp)
        if (result.op1Prime) {
          transformedOp = result.op1Prime
        }
      }
    }
    
    return transformedOp
  }

  /**
   * Check if two operations can be safely composed
   */
  canCompose(op1: Operation, op2: Operation): boolean {
    // Operations can be composed if they are sequential and non-conflicting
    return (
      op1.userId === op2.userId &&
      op1.timestamp < op2.timestamp &&
      this.areSequential(op1, op2) &&
      !this.hasStructuralConflicts(op1, op2)
    )
  }

  /**
   * Compose two operations into a single operation
   */
  compose(op1: Operation, op2: Operation): Operation {
    if (!this.canCompose(op1, op2)) {
      throw new Error('Operations cannot be composed')
    }

    return {
      ...op1,
      id: `${op1.id}-${op2.id}`,
      data: this.composeData(op1, op2),
      timestamp: op2.timestamp,
      metadata: {
        ...op1.metadata,
        groupId: op1.metadata.groupId || op1.id,
        composed: true,
        originalOps: [op1.id, op2.id]
      }
    }
  }

  /**
   * Calculate the inverse of an operation for undo functionality
   */
  invert(operation: Operation): Operation {
    const invertRules: Record<OperationType, (op: Operation) => Operation> = {
      insert: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'delete',
        data: {
          ...op.data,
          length: op.data.content?.length || 0
        }
      }),
      
      delete: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'insert',
        data: {
          content: op.data.content || '',
          attributes: op.data.attributes
        }
      }),
      
      retain: (op) => op, // Retain operations are self-inverse
      
      format: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        data: {
          ...op.data,
          attributes: this.invertAttributes(op.data.attributes || {})
        }
      }),
      
      move: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        position: {
          start: op.data.newPosition || op.position.start,
          end: op.data.newPosition || op.position.end
        },
        data: {
          ...op.data,
          newPosition: op.position.start
        }
      }),
      
      replace: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        data: {
          content: op.data.originalContent || '',
          originalContent: op.data.content,
          attributes: op.data.originalAttributes,
          originalAttributes: op.data.attributes
        }
      }),
      
      split: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'merge',
        data: {
          targetBlockId: op.data.blockId,
          sourceBlockId: op.data.newBlockId
        }
      }),
      
      merge: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'split',
        data: {
          blockId: op.data.targetBlockId,
          newBlockId: op.data.sourceBlockId || `split-${Date.now()}`
        }
      }),
      
      lock: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'unlock'
      }),
      
      unlock: (op) => ({
        ...op,
        id: `inv-${op.id}`,
        type: 'lock'
      })
    }

    return invertRules[operation.type](operation)
  }

  private initializeTransformRules(): void {
    // Insert vs Insert
    this.transformRules.set('insert-insert', {
      transform: (op1, op2) => {
        if (op1.position.start <= op2.position.start) {
          return {
            op1Prime: op1,
            op2Prime: {
              ...op2,
              position: {
                ...op2.position,
                start: op2.position.start + (op1.data.content?.length || 0)
              }
            },
            transformType: 'position_shift',
            reason: 'Concurrent insert: shifted second operation',
            confidence: 0.95
          }
        } else {
          return {
            op1Prime: {
              ...op1,
              position: {
                ...op1.position,
                start: op1.position.start + (op2.data.content?.length || 0)
              }
            },
            op2Prime: op2,
            transformType: 'position_shift',
            reason: 'Concurrent insert: shifted first operation',
            confidence: 0.95
          }
        }
      }
    })

    // Insert vs Delete
    this.transformRules.set('insert-delete', {
      transform: (op1, op2) => {
        if (op1.position.start <= op2.position.start) {
          return {
            op1Prime: op1,
            op2Prime: {
              ...op2,
              position: {
                ...op2.position,
                start: op2.position.start + (op1.data.content?.length || 0),
                end: (op2.position.end || op2.position.start) + (op1.data.content?.length || 0)
              }
            },
            transformType: 'position_shift',
            reason: 'Insert before delete: adjusted delete position',
            confidence: 0.9
          }
        } else if (op1.position.start < (op2.position.end || op2.position.start)) {
          // Insert within delete range - complex case
          return this.handleInsertWithinDelete(op1, op2)
        } else {
          return {
            op1Prime: {
              ...op1,
              position: {
                ...op1.position,
                start: op1.position.start - (op2.data.length || 0)
              }
            },
            op2Prime: op2,
            transformType: 'position_shift',
            reason: 'Delete before insert: adjusted insert position',
            confidence: 0.9
          }
        }
      }
    })

    // Delete vs Delete
    this.transformRules.set('delete-delete', {
      transform: (op1, op2) => {
        const op1End = op1.position.end || op1.position.start + (op1.data.length || 0)
        const op2End = op2.position.end || op2.position.start + (op2.data.length || 0)

        if (op1End <= op2.position.start) {
          // No overlap, shift second delete
          return {
            op1Prime: op1,
            op2Prime: {
              ...op2,
              position: {
                ...op2.position,
                start: op2.position.start - (op1.data.length || 0),
                end: op2End - (op1.data.length || 0)
              }
            },
            transformType: 'position_shift',
            reason: 'Sequential deletes',
            confidence: 0.95
          }
        } else if (op2End <= op1.position.start) {
          // No overlap, shift first delete
          return {
            op1Prime: {
              ...op1,
              position: {
                ...op1.position,
                start: op1.position.start - (op2.data.length || 0),
                end: op1End - (op2.data.length || 0)
              }
            },
            op2Prime: op2,
            transformType: 'position_shift',
            reason: 'Sequential deletes',
            confidence: 0.95
          }
        } else {
          // Overlapping deletes - complex merge
          return this.handleOverlappingDeletes(op1, op2)
        }
      }
    })

    // Format operations
    this.transformRules.set('format-format', {
      transform: (op1, op2) => this.handleFormatConflict(op1, op2)
    })

    // Add more transform rules for other operation combinations...
    this.addAdvancedTransformRules()
  }

  private initializeConflictDetectors(): void {
    this.conflictDetectors.set('concurrent_edit', {
      detect: (op1, op2, result) => {
        return op1.timestamp === op2.timestamp && 
               op1.userId !== op2.userId &&
               this.hasPositionOverlap(op1, op2)
      },
      severity: 'medium'
    })

    this.conflictDetectors.set('content_overlap', {
      detect: (op1, op2, result) => {
        return (op1.type === 'insert' || op1.type === 'delete') &&
               (op2.type === 'insert' || op2.type === 'delete') &&
               this.hasContentOverlap(op1, op2)
      },
      severity: 'high'
    })

    this.conflictDetectors.set('format_conflict', {
      detect: (op1, op2, result) => {
        return op1.type === 'format' && op2.type === 'format' &&
               this.hasAttributeConflicts(op1.data.attributes || {}, op2.data.attributes || {})
      },
      severity: 'low'
    })

    // Add more conflict detectors...
  }

  private addAdvancedTransformRules(): void {
    // Move operations
    this.transformRules.set('move-move', {
      transform: (op1, op2) => this.handleMoveConflict(op1, op2)
    })

    this.transformRules.set('move-insert', {
      transform: (op1, op2) => this.handleMoveInsert(op1, op2)
    })

    this.transformRules.set('move-delete', {
      transform: (op1, op2) => this.handleMoveDelete(op1, op2)
    })

    // Replace operations
    this.transformRules.set('replace-replace', {
      transform: (op1, op2) => this.handleReplaceConflict(op1, op2)
    })

    // Structure operations
    this.transformRules.set('split-merge', {
      transform: (op1, op2) => this.handleSplitMergeConflict(op1, op2)
    })
  }

  private handleInsertWithinDelete(insertOp: Operation, deleteOp: Operation): TransformRuleResult {
    // When insert happens within a delete range, we need to decide priority
    const deleteLength = deleteOp.data.length || 0
    const insertLength = insertOp.data.content?.length || 0
    
    // Priority-based resolution: later timestamp wins
    if (insertOp.timestamp > deleteOp.timestamp) {
      // Insert wins - modify delete to exclude inserted content
      return {
        op1Prime: {
          ...insertOp,
          position: {
            ...insertOp.position,
            start: deleteOp.position.start
          }
        },
        op2Prime: {
          ...deleteOp,
          data: {
            ...deleteOp.data,
            length: deleteLength + insertLength
          },
          position: {
            ...deleteOp.position,
            end: (deleteOp.position.end || deleteOp.position.start) + insertLength
          }
        },
        transformType: 'content_merge',
        reason: 'Insert within delete: insert takes priority',
        confidence: 0.7
      }
    } else {
      // Delete wins - insert is cancelled
      return {
        op1Prime: null, // Insert is cancelled
        op2Prime: deleteOp,
        transformType: 'conflict_resolve',
        reason: 'Insert within delete: delete takes priority',
        confidence: 0.8
      }
    }
  }

  private handleOverlappingDeletes(op1: Operation, op2: Operation): TransformRuleResult {
    const op1Start = op1.position.start
    const op1End = op1.position.end || op1Start + (op1.data.length || 0)
    const op2Start = op2.position.start
    const op2End = op2.position.end || op2Start + (op2.data.length || 0)

    // Calculate merged delete range
    const mergedStart = Math.min(op1Start, op2Start)
    const mergedEnd = Math.max(op1End, op2End)
    
    // Create a single merged delete operation
    const mergedOp: Operation = {
      ...op1,
      id: `merged-${op1.id}-${op2.id}`,
      position: {
        start: mergedStart,
        end: mergedEnd
      },
      data: {
        ...op1.data,
        length: mergedEnd - mergedStart,
        mergedFrom: [op1.id, op2.id]
      },
      metadata: {
        ...op1.metadata,
        transformType: 'merge_operations'
      }
    }

    return {
      op1Prime: mergedOp,
      op2Prime: null, // Second operation is absorbed
      transformType: 'content_merge',
      reason: 'Overlapping deletes merged into single operation',
      confidence: 0.85
    }
  }

  private handleFormatConflict(op1: Operation, op2: Operation): TransformRuleResult {
    const attrs1 = op1.data.attributes || {}
    const attrs2 = op2.data.attributes || {}
    
    // Merge attributes with later timestamp taking priority for conflicts
    const mergedAttributes = { ...attrs1 }
    
    for (const [key, value] of Object.entries(attrs2)) {
      if (key in mergedAttributes) {
        // Conflict detected - use timestamp to resolve
        if (op2.timestamp >= op1.timestamp) {
          mergedAttributes[key] = value
        }
      } else {
        mergedAttributes[key] = value
      }
    }

    return {
      op1Prime: {
        ...op1,
        data: {
          ...op1.data,
          attributes: mergedAttributes
        }
      },
      op2Prime: null, // Absorbed into first operation
      transformType: 'format_override',
      reason: 'Format attributes merged with timestamp priority',
      confidence: 0.9
    }
  }

  private handleMoveConflict(op1: Operation, op2: Operation): TransformRuleResult {
    // Two move operations on potentially same content
    if (op1.data.blockId === op2.data.blockId) {
      // Same block being moved - later operation wins
      if (op2.timestamp > op1.timestamp) {
        return {
          op1Prime: null,
          op2Prime: op2,
          transformType: 'conflict_resolve',
          reason: 'Move conflict: later operation wins',
          confidence: 0.9
        }
      } else {
        return {
          op1Prime: op1,
          op2Prime: null,
          transformType: 'conflict_resolve',
          reason: 'Move conflict: earlier operation wins',
          confidence: 0.9
        }
      }
    }

    // Different blocks - both operations can proceed
    return {
      op1Prime: op1,
      op2Prime: op2,
      transformType: 'position_shift',
      reason: 'Independent move operations',
      confidence: 1.0
    }
  }

  private handleMoveInsert(op1: Operation, op2: Operation): TransformRuleResult {
    // Move operation vs insert operation
    const insertPos = op2.position.start
    const moveStart = op1.position.start
    const moveEnd = op1.position.end || moveStart

    if (insertPos < moveStart) {
      // Insert before move source
      return {
        op1Prime: {
          ...op1,
          position: {
            ...op1.position,
            start: moveStart + (op2.data.content?.length || 0),
            end: moveEnd ? moveEnd + (op2.data.content?.length || 0) : undefined
          }
        },
        op2Prime: op2,
        transformType: 'position_shift',
        reason: 'Insert before move: adjusted move positions',
        confidence: 0.95
      }
    }

    // More complex cases...
    return {
      op1Prime: op1,
      op2Prime: op2,
      transformType: 'position_shift',
      reason: 'Move-insert: no conflict',
      confidence: 0.9
    }
  }

  private handleMoveDelete(op1: Operation, op2: Operation): TransformRuleResult {
    // Implementation for move vs delete conflicts
    return {
      op1Prime: op1,
      op2Prime: op2,
      transformType: 'structure_adapt',
      reason: 'Move-delete transformation',
      confidence: 0.8
    }
  }

  private handleReplaceConflict(op1: Operation, op2: Operation): TransformRuleResult {
    // Two replace operations on same content
    if (this.hasPositionOverlap(op1, op2)) {
      // Later timestamp wins
      if (op2.timestamp > op1.timestamp) {
        return {
          op1Prime: null,
          op2Prime: op2,
          transformType: 'conflict_resolve',
          reason: 'Replace conflict: later operation wins',
          confidence: 0.85
        }
      }
    }

    return {
      op1Prime: op1,
      op2Prime: op2,
      transformType: 'content_merge',
      reason: 'Independent replace operations',
      confidence: 0.95
    }
  }

  private handleSplitMergeConflict(op1: Operation, op2: Operation): TransformRuleResult {
    // Split vs merge on same block
    if (op1.data.blockId === op2.data.targetBlockId) {
      // Conflicting structure operations
      return {
        op1Prime: null,
        op2Prime: null,
        transformType: 'conflict_resolve',
        reason: 'Split-merge conflict: operations cancelled',
        confidence: 0.6
      }
    }

    return {
      op1Prime: op1,
      op2Prime: op2,
      transformType: 'structure_adapt',
      reason: 'Independent structure operations',
      confidence: 0.9
    }
  }

  private detectConflicts(op1: Operation, op2: Operation, result: TransformRuleResult): OperationConflict[] {
    const conflicts: OperationConflict[] = []

    for (const [type, detector] of this.conflictDetectors) {
      if (detector.detect(op1, op2, result)) {
        conflicts.push({
          id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conflictingOperation: op2.id,
          type,
          severity: detector.severity,
          resolution: 'operational_transform',
          data: {
            op1: op1.id,
            op2: op2.id,
            transformResult: result
          }
        })
      }
    }

    return conflicts
  }

  private hasPositionOverlap(op1: Operation, op2: Operation): boolean {
    const op1End = op1.position.end || op1.position.start + (op1.data.length || op1.data.content?.length || 0)
    const op2End = op2.position.end || op2.position.start + (op2.data.length || op2.data.content?.length || 0)

    return !(op1End <= op2.position.start || op2End <= op1.position.start)
  }

  private hasContentOverlap(op1: Operation, op2: Operation): boolean {
    return this.hasPositionOverlap(op1, op2) && 
           (op1.data.blockId === op2.data.blockId || !op1.data.blockId || !op2.data.blockId)
  }

  private hasAttributeConflicts(attrs1: Record<string, any>, attrs2: Record<string, any>): boolean {
    for (const key of Object.keys(attrs1)) {
      if (key in attrs2 && attrs1[key] !== attrs2[key]) {
        return true
      }
    }
    return false
  }

  private areSequential(op1: Operation, op2: Operation): boolean {
    // Check if operations are logically sequential
    return Math.abs(op2.timestamp.getTime() - op1.timestamp.getTime()) < 1000 // 1 second threshold
  }

  private hasStructuralConflicts(op1: Operation, op2: Operation): boolean {
    // Check for structural conflicts that prevent composition
    const structuralOps = ['split', 'merge', 'move']
    return structuralOps.includes(op1.type) || structuralOps.includes(op2.type)
  }

  private composeData(op1: Operation, op2: Operation): any {
    // Compose operation data based on types
    if (op1.type === 'insert' && op2.type === 'insert') {
      return {
        ...op1.data,
        content: (op1.data.content || '') + (op2.data.content || '')
      }
    }
    
    if (op1.type === 'delete' && op2.type === 'delete') {
      return {
        ...op1.data,
        length: (op1.data.length || 0) + (op2.data.length || 0)
      }
    }

    return op2.data // Default to second operation's data
  }

  private invertAttributes(attributes: Record<string, any>): Record<string, any> {
    const inverted: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(attributes)) {
      switch (key) {
        case 'bold':
        case 'italic':
        case 'underline':
        case 'strikethrough':
          inverted[key] = !value
          break
        case 'color':
        case 'backgroundColor':
          inverted[key] = null // Remove color
          break
        case 'fontSize':
          inverted[key] = 14 // Default font size
          break
        default:
          inverted[key] = null
      }
    }
    
    return inverted
  }

  private handleUnknownTransform(op1: Operation, op2: Operation): TransformResult {
    console.warn(`Unknown transform rule for ${op1.type}-${op2.type}`)
    
    return {
      op1Prime: op1,
      op2Prime: op2,
      conflicts: [],
      confidence: 0.5,
      metadata: {
        transformType: 'semantic_preserve',
        reason: 'Unknown transform rule - preserved both operations',
        timestamp: new Date()
      }
    }
  }

  private handleTransformError(op1: Operation, op2: Operation, error: Error): TransformResult {
    console.error('Transform error:', error)
    
    return {
      op1Prime: op1,
      op2Prime: op2,
      conflicts: [{
        id: `error-${Date.now()}`,
        conflictingOperation: op2.id,
        type: 'version_mismatch',
        severity: 'critical',
        resolution: 'manual_resolution',
        data: { error: error.message }
      }],
      confidence: 0.0,
      metadata: {
        transformType: 'semantic_preserve',
        reason: `Transform error: ${error.message}`,
        timestamp: new Date()
      }
    }
  }
}

// Supporting interfaces
interface TransformRule {
  transform: (op1: Operation, op2: Operation) => TransformRuleResult
}

interface TransformRuleResult {
  op1Prime: Operation | null
  op2Prime: Operation | null
  transformType: string
  reason: string
  confidence?: number
}

interface TransformResult {
  op1Prime: Operation | null
  op2Prime: Operation | null
  conflicts: OperationConflict[]
  confidence: number
  metadata: {
    transformType: string
    reason: string
    timestamp: Date
  }
}

interface ConflictDetector {
  detect: (op1: Operation, op2: Operation, result: TransformRuleResult) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}