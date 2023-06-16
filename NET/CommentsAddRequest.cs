using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class CommentsAddRequest
    {
        
        [StringLength(50)]
        public string Subject { get; set; }

        [Required]
        [StringLength(3000)]
        public string Text { get; set; }

        [Range(1, Int32.MaxValue)]
        public int? ParentId { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityTypeId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityId { get; set; }
    }
}
